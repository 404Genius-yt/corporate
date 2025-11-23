import { model, models, Schema } from "mongoose";

export interface IJob {
  title: string;
  company: string;
  description: string;
  location?: string;
  url: string;
  source: string;
  publishedDate: Date;
  skills?: string[];
  matchScore?: number;
  appliedBy?: string[];
  createdAt: Date;
  updatedAt: Date;
}

const JobSchema = new Schema<IJob>({
  title: {
    type: String,
    required: true,
  },
  company: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  location: {
    type: String,
  },
  url: {
    type: String,
    required: true,
    unique: true,
  },
  source: {
    type: String,
    required: true,
  },
  publishedDate: {
    type: Date,
    default: Date.now,
  },
  skills: {
    type: [String],
    default: [],
  },
  matchScore: {
    type: Number,
    default: 0,
  },
  appliedBy: {
    type: [String],
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

export const Job = models?.Job || model("Job", JobSchema);

