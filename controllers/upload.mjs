import signale from "signale";
import stream from "stream";
import { fileURLToPath } from 'url';
import path from "path";
import { google } from "googleapis";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const uploadController = {
  get: (req, res) => {
    res.status(200).send("Root de /upload");
  },
  post: async (req, res) => {
    console.log("REQ: ", req.files)
    const data = await uploadFile(req.files);
    if (data)
        res.status(200).send({status: true, data:data});
    else
        res.status(200).send({status:false, data:{}})
  },
};

const uploadFile = async (fileObject) => {
  const folderId = "1d6sThCZuk2_Q6DRk__tiCJLRwL-LTvlp";
  const bufferStream = new stream.PassThrough();
  bufferStream.end(fileObject.file.data);
  const drive = await getDriveService();
  const { data } = await drive.files.create({
    resource: {
      name: fileObject.file.name,
      parents: [folderId],
    },
    media: {
      mimeType: fileObject.file.mimeType,
      body: bufferStream,
    },
    fields: "id,name,webViewLink",
  });
  //console.log(`Uploaded file ${data.name} ${data.id}`);
  //console.log(JSON.stringify(data))
  return data ? data : null;
};

const getDriveService = () => {
  const KEYFILEPATH = path.join(
    __dirname,
    "uploaddrive-405504-668ffa31c5b4.json"
  );
  const SCOPES = ["https://www.googleapis.com/auth/drive"];

  const auth = new google.auth.GoogleAuth({
    keyFile: KEYFILEPATH,
    scopes: SCOPES,
  });
  const driveService = google.drive({ version: "v3", auth });
  return driveService;
};


