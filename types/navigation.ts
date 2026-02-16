import { Puzzle } from "./puzzle";

export type RootStackParamList = {
  Start: undefined;
  Game: { puzzle: Puzzle };
};