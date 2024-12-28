import type { StarlightSidebarTopicsDropdownUserConfig } from "starlight-sidebar-topics-dropdown";

const sidebarData: StarlightSidebarTopicsDropdownUserConfig = [
	{
		label: {
			en: "Class 12",
			hi: "कक्षा 12",
		},
		icon: "open-book",
		link: "/class-12/",
		items: [
			{
				label: "Computer Science",
				autogenerate: { directory: "class 12/Computer Science" },
			},
			{
				label: "Mathematics",
				translations: {
					hi: "गणित",
				},
				autogenerate: { directory: "class 12/Mathematics" },
			},
			{
				label: "English",
				autogenerate: { directory: "class 12/English" },
			},
		],
	},
	{
		label: {
			en: "Class 11",
			hi: "कक्षा 11",
		},
		link: "/class-11/",
		icon: "open-book",
		items: [
			{
				label: "Computer Science",
				autogenerate: { directory: "class 11/Computer Science" },
			},
		],
	},
];

export default sidebarData;
