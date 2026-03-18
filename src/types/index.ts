import { Optional } from "sequelize";

export interface EmailJobsAttributes {
  id: number;
  queue_name: string | null;
  job_id: string | null;
  to_address: string;
  subject: string;
  body: string;
  status: string;
  attempts: number;
  max_attempts: number;
  result: string | null;
  error: string | null;
}

export interface EmailJobsCreationAttributes
  extends Optional<
    EmailJobsAttributes,
    | "id"
    | "status"
    | "attempts"
    | "max_attempts"
    | "result"
    | "error"
    | "queue_name"
    | "job_id"
  > {}

export interface EmailJobData {
  to_address: string;
  subject: string;
  body: string;
}

export interface UserAttributes {
  id: number;
  name: string;
  password: string;
  email: string;
  role: string;
  organization_id: string;
}

export interface OrganizationAttributes {
  id: string;
  organization_name: string;
}

export interface OrganizationCreationAttributes
  extends Optional<OrganizationAttributes, "id"> {}

export interface UserCreationAttributes
  extends Optional<UserAttributes, "id"> {}
