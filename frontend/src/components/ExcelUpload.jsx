import { useState } from "react";
import cookie from "js-cookie";

function ExcelUpload() {
  const [file, setFile] = useState(null);

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append("file", file);

    
    if ( file.type !== "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
      alert("Only excel files are allowed");
      return;
    }

    try {
      const res = await fetch(
        "http://localhost:5000/api/v1/admin/upload",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${cookie.get("token")}`,
            role: `admin`,
          },
          body: formData,
        }
      );

      if (res.ok) {
        console.log("file uploaded successfully");
        let data = await res.json();
        console.log(data);
      } else {
        console.log("error uploading file");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h1>Upload Excel File</h1>
      <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      <button onClick={handleUpload}>Upload</button>
    </div>
  );
}

export default ExcelUpload;
