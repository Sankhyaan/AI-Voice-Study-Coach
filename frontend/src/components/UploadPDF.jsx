import { useState } from "react";
import API from "../services/api";

function UploadPDF() {

  const [files, setFiles] = useState([]);

  const uploadFiles = async () => {

    try {

      const formData = new FormData();

      for (let i = 0; i < files.length; i++) {

        formData.append(
          "files",
          files[i]
        );

      }

      const response = await API.post(
        "/upload",
        formData
      );

      alert(
        response.data.message
      );

    }

    catch(error){

      console.log(error);

      alert(
        "Upload Failed"
      );

    }

  };

  return (

    <div>

      <h2>
        Upload PDFs
      </h2>

      <input
        type="file"
        multiple
        onChange={(e) =>
          setFiles(
            e.target.files
          )
        }
      />

      <br />
      <br />

      <button
        onClick={
          uploadFiles
        }
      >
        Upload
      </button>

    </div>

  );

}

export default UploadPDF;