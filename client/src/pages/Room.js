import React from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import "./Home.css";
import {
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Grid,
  useTheme,
} from "@mui/material";

const columns = [
  {
    id: "entryCode",
    label: "Code",
    minWidth: "33.3333%",
    align: "left",
  },
  {
    id: "users",
    label: "# Users",
    minWidth: "33.3333%",
    align: "left",
  },
  {
    id: "Button",
    label: "",
    minWidth: "33.33333%",
    align: "left",
  },
];

function Room() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const theme = useTheme();
  const [rooms, setRooms] = useState([]);
  const [isCreatingRoom, setIsCreatingRoom] = useState(false);

  const createRoom = async () => {
    try {
      const response = await axios.post(
        "http://localhost:8000/auth/createRoom/",
        {},
        {
          withCredentials: true,
        }
      );
      navigate(`/pokerroom/${response.data.entry_code}`);
      return response.data;
    } catch (error) {
      if (error.response && error.response.status === 403) {
        console.log("Unauthorized");
        navigate("/login");
      } else {
        console.error("Error:", error);
      }
    }
  };

  const { data, refetch } = useQuery({
    queryKey: ["createRoom"],
    queryFn: createRoom,
    enabled: false,
    refetchOnWindowFocus: false,
  });

  const { isLoading, isError, error } = useQuery({
    queryKey: ["userInfo"],
    queryFn: async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/auth/userInfo/",
          {
            withCredentials: true,
          }
        );
        setUser(response.data);
        return response.data; // Make sure to return data
      } catch (error) {
        if (error.response && error.response.status === 403) {
          console.log("Unauthorized");
          navigate("/login");
        } else {
          console.error("Error:", error);
        }
        throw new Error(error); // Rethrow the error
      }
    },
    refetchOnWindowFocus: false,
  });

  useQuery({
    queryKey: ["roomInfo"],
    queryFn: async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/auth/roomInfo/",
          {
            withCredentials: true,
          }
        );
        console.log(response.data);
        setRooms(response.data);
        return response.data; // Make sure to return data
      } catch (error) {
        if (error.response && error.response.status === 403) {
          console.log("Unauthorized");
          navigate("/login");
        } else {
          console.error("Error:", error);
        }
        throw new Error(error); // Rethrow the error
      }
    },
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (user) {
      console.log(user);
    }
  }, [user]);

  const handleClick = (entry_code) => {
    navigate(`/pokerroom/${entry_code}`);
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error: {error.message}</div>;

  return (
    <div className="main-container">
      <Grid
        container
        direction="column"
        alignItems="center"
        justifyContent="center"
        spacing={2}
      >
        <Grid item>
          <Paper sx={{ width: "100%", overflow: "hidden" }}>
            <TableContainer sx={{ maxHeight: "440px" }}>
              <Table stickyHeader size="small" aria-label="simple table">
                <TableHead sx={{ backgroundColor: "blue" }}>
                  <TableRow>
                    {columns.map((column) => (
                      <TableCell
                        key={column.id}
                        align="center"
                        style={{
                          minWidth: column.minWidth,
                          color: theme.palette.customDarkGrey.contrastText,
                          fontWeight: "bold",
                          backgroundColor: theme.palette.customDarkGrey.main,
                        }}
                      >
                        {column.label}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rooms.map((val) => (
                    <TableRow
                      key={val.entry_code}
                      sx={{
                        "&:last-child td, &:last-child th": { border: 0 },
                        backgroundColor: theme.palette.customDarkGrey.main,
                      }}
                    >
                      <TableCell
                        sx={{
                          color: theme.palette.customDarkGrey.contrastText,
                        }}
                        align="center"
                      >
                        {val.entry_code}
                      </TableCell>
                      <TableCell
                        align="center"
                        sx={{
                          color: theme.palette.customDarkGrey.contrastText,
                        }}
                      >
                        {val.users.length}
                      </TableCell>
                      <TableCell align="center">
                        <Button
                          color="secondary"
                          variant="contained"
                          size="small"
                          onClick={() => handleClick(val.entry_code)}
                        >
                          Join Room
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
        <Grid item>
          <Button
            color="customDarkGrey"
            variant="contained"
            onClick={() => refetch()}
          >
            Create
          </Button>
        </Grid>
      </Grid>
    </div>
  );
}

export default Room;
