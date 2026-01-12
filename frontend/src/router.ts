import { createRouter } from "sv-router";
import StartMenuView from "$/views/startMenu/StartMenuView.svelte";
import BoardView from "$/views/board/BoardView.svelte";

const routes = {
  "/": StartMenuView,
  "/board": BoardView,
};

export const { p, navigate, isActive, route } = createRouter(routes);
