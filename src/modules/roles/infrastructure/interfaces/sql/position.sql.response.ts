export interface PositionSQLResponse {
  cargo_id: number;
  name: string;
  level_jerarchy: number;
  description?: string;
  is_active: boolean | null | number;
  creation_date: Date;
  updated_at: Date;
}
