import React from "react";
import { useAllArtworksApiQuery } from "../api/allArtworkApi";
const {
    data: allArtworks = [],
    isLoading: isLoadingAll,
    isError: isErrorAll,
    refetch: refetchAll,
  } = useAllArtworksApiQuery();