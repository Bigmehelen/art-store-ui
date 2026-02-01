// import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// export const parkingApi = createApi({
//   reducerPath: "parkingApi",
//   baseQuery: fetchBaseQuery({
//     baseUrl: "https://smrt-park-backend.onrender.com",
//     prepareHeaders: (headers, { getState }) => {
//       const token = getState().auth.token;

//       if (token) {
//         headers.set("Authorization", `Bearer ${token}`);
//       }
//       return headers;
//     },
//   }),
//   endpoints: (builder) => ({
//     getParkingSpots: builder.query({
//       query: () => "/api/owner/parking-spaces/all",
//     }),
//   }),
// });
