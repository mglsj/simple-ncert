import type { StarlightSidebarTopicsDropdownUserConfig } from "starlight-sidebar-topics-dropdown";

const sidebarData: StarlightSidebarTopicsDropdownUserConfig = [
	{
		label: {
			en: "Class 10",
			hi: "कक्षा 11",
		},
		link: "/class-10/",
		icon: "open-book",
		items: [
			{
				label: "Science",
				autogenerate: { directory: "class 10/Science" },
				collapsed: true,
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
				collapsed: true,
			},
		],
	},
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
				collapsed: true,
			},
			{
				label: "English",
				autogenerate: { directory: "class 12/English" },
				collapsed: true,
			},
			{
				label: "Informatics Practices",
				autogenerate: { directory: "class 12/Informatics Practices" },
				collapsed: true,
			},
			{
				label: "Mathematics",
				translations: {
					hi: "गणित",
				},
				autogenerate: { directory: "class 12/Mathematics" },
				collapsed: true,
			},
			{
				label: "Physics",
				autogenerate: { directory: "class 12/Physics" },
				collapsed: true,
			},
		],
	},
];

export default sidebarData;
