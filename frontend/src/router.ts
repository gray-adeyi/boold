import { createRouter } from "sv-router";
import StartMenuView from "$/views/startMenu/StartMenuView.svelte";

const routes = {
  '/': StartMenuView
};

const {} =  createRouter(routes)