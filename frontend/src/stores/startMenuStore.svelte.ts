export type StartMenuStoreState = {
	isAMenuOptionOpen: boolean;
	openedMenuHeight: number;
};

export const state: StartMenuStoreState = $state({
	isAMenuOptionOpen: false,
	openedMenuHeight: 0,
});

export const setIsAMenuOptionOpen = (value: boolean) => {
	state.isAMenuOptionOpen = value;
};
export const setOpenedMenuHeight = (value: number) => {
	state.openedMenuHeight = value;
};
