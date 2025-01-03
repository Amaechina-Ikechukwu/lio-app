import { router } from "expo-router";
import React from "react";
import PreviewPortfolio from "../../components/CreatePorfolio/PreviewPortfolio";
import { Liostore } from "../../constants/Store";
export default function CreateImageAlbum() {
  const { projectId } = Liostore((state: any) => ({
    projectId: state.projectId,
  }));

  const goToProfile = () => {
    router.push(`/`);
  };

  return <PreviewPortfolio update={true} navigate={() => goToProfile()} />;
}
