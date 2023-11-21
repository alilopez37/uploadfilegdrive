import signale from "signale";
import stream from "stream";
import { fileURLToPath } from 'url';
import path from "path";
import {query} from '../database/mysql.js'
import { google } from "googleapis"; 


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const uploadController = {
  get: (req, res) => {
    res.status(200).send("Root de /upload");
  },

  post: async (req, res) => {
    const {name, description} = req.body;
    const url_image = await uploadFile(req.files);
    if (url_image) {
      const sql = "INSERT INTO product (name, description, url_image) VALUES (?, ?, ?)";
      const params = [name, description, url_image];
      try {
        const [result] = await query(sql, params);
        console.log(result)
        res.status(200).send({status: true, data:{
          id_product: result.insertId,
          name: name,
          description: description,
          url_image: url_image
        }});
      } catch (error) {
        res.status(200).send({status:false, data:{}})
      }
    }
  
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
  console.log(data.webViewLink)
  return data ? data.webViewLink : null;
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


