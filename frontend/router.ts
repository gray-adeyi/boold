import { createRouter } from "sv-router";
import StartMenuView from "$/views/startMenu/StartMenuView.svelte";
import WorkspaceView from "$/views/workspace/WorkspaceView.svelte";

const routes = {
	"/": StartMenuView,
	"/workspace": WorkspaceView,
};

export const { p, navigate, isActive, route } = createRouter(routes);
