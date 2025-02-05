import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchFiles = createAsyncThunk("files/fetch", async () => {
  const response = await axios.get("http://localhost:8080/api/files");
  return response.data;
});