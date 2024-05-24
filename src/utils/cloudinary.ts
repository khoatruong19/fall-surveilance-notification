const uploadImage = async (file: Blob) => {
  if (!file) return null;

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "fallsurveillanceapp");

  try {
    const response = await fetch(
      "https://api.cloudinary.com/v1_1/dzo2rkafy/upload",
      {
        method: "POST",
        body: formData,
      }
    );
    return response.json();
  } catch (error) {
    return null;
  }
};

export default { uploadImage };
