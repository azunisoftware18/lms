export const colorVariables = {
	PRIMARY_COLOR: 'text-blue-600',
	PRIMARY_BUTTON_COLOR: 'bg-blue-600 hover:bg-blue-700',
	BORDER_COLOR: 'border-blue-500',
	LIGHT_BG: 'bg-blue-50',
	BACKGROUND_DARK: 'bg-[#0b173e]',
	SECONDARY_COLOR: 'bg-blue-600 hover:bg-blue-700',
	EXECUTIVE_COLOR: 'text-red-600 bg-red-100',
	INDEPENDENT_COLOR: 'text-green-600 bg-green-100',
	NOMINEE_COLOR: 'text-yellow-600 bg-yellow-100',
	DEFAULT_COLOR: 'text-gray-600 bg-gray-100',
};


export const getTypeColor = (type) => {
	switch (type) {
		case 'Executive':
			return colorVariables.EXECUTIVE_COLOR;
		case 'Independent':
			return colorVariables.INDEPENDENT_COLOR;
		case 'Nominee':
			return colorVariables.NOMINEE_COLOR;
		default:
			return colorVariables.DEFAULT_COLOR;
	}
};
