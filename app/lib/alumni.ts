import mongoose, { Schema } from "mongoose";

const photoSchema = new Schema(
  {
    name: { type: String },
    type: { type: String },
    size: { type: Number },
    url: { type: String },
    publicId: { type: String },
    dataUrl: { type: String },
  },
  { _id: false },
);

const submissionSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    dateOfBirth: { type: String, required: true, trim: true },
    motherName: { type: String, required: true, trim: true },
    fatherName: { type: String, required: true, trim: true },
    className: { type: String, required: true, trim: true },
    honsMajorSubject: { type: String, required: true, trim: true },
    session: { type: String, required: true, trim: true },
    occupation: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    whatsapp: { type: String, required: true, trim: true },
    presentAddress: { type: String, required: true, trim: true },
    achievements: { type: String, trim: true },
    photo: photoSchema,
    sheetSync: {
      status: {
        type: String,
        enum: ["synced", "skipped", "failed"],
        default: "skipped",
      },
      message: String,
    },
  },
  { timestamps: true },
);

export type AlumniSubmissionInput = {
  name: string;
  dateOfBirth: string;
  motherName: string;
  fatherName: string;
  className: string;
  honsMajorSubject: string;
  session: string;
  occupation: string;
  email: string;
  whatsapp: string;
  presentAddress: string;
  achievements: string;
  photo?: {
    name: string;
    type: string;
    size: number;
    url: string;
    publicId: string;
    dataUrl?: string;
  };
};

export const AlumniSubmission =
  mongoose.models.AlumniSubmission ||
  mongoose.model("AlumniSubmission", submissionSchema);
