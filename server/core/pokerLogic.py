from pokerkit import NoLimitTexasHoldem
from django.core.cache import cache
import logging

logger = logging.getLogger("django")

def generate_game_state(entry_code):

    room_info = cache.get(entry_code)

    data = {
        'ante': 0,
        'blinds': (1, 2),
        'min_bet': 2,
        'starting_stacks': (200, 200, 200),
        'num_players': 2
    }

    state = NoLimitTexasHoldem.create_state(
        # automations
        (),
        True,  # False for big blind ante, True otherwise
        data['ante'],  # ante
        data['blinds'],  # blinds or straddles
        data['min_bet'],  # min bet
        data['starting_stacks'],  # starting stacks
        data['num_players'],  # number of players
    )

    room_info['game_state'] = state

    cache.set(entry_code, room_info)
    return True


async def automate_animations(channel_layer, entry_code):
    room_info = cache.get(entry_code)
    state = room_info['game_state']
    if state is None:
        return False
    
    while state.status:
        if state.can_post_ante():
            state.post_ante()
        elif state.can_collect_bets():
            state.collect_bets()
        elif state.can_post_blind_or_straddle():
            state.post_blind_or_straddle()
            await emit_message_to_clients(channel_layer, entry_code, "Posted blind or straddle", room_info_serializer(room_info))
        elif state.can_burn_card():
            state.burn_card('??')
        elif state.can_deal_hole():
            state.deal_hole()
            await emit_message_to_clients(channel_layer, entry_code, "dealt hole card", room_info_serializer(room_info))
        elif state.can_deal_board():
            state.deal_board()
        elif state.can_kill_hand():
            state.kill_hand()
        elif state.can_push_chips():
            state.push_chips()
        elif state.can_pull_chips():
            state.pull_chips()
        else:
            room_info['game_state'] = state
            cache.set(entry_code, room_info)
            return True

async def emit_message_to_clients(channel_layer, entry_code, message, room_info):
    game_update = room_info_serializer(room_info)

    await channel_layer.group_send(
        f'chat_{entry_code}',
        {
            'type': 'game_update',
            'message': message,
            'room_info': game_update, # convert room_info.state into a serializable object before sending it across
        }
    )

def room_info_serializer(room_info):
    data = {
        "players": room_info['players'],
        "gameState": "Updated game state"
    }
    return data
