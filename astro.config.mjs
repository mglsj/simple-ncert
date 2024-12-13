import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";

// https://astro.build/config
export default defineConfig({
	site: "https://mglsj.github.io/",
	base: "/simple-ncert/",
	integrations: [
		starlight({
			title: "Simple NCERT",
			social: {
				github: "https://github.com/mglsj/simple-ncert",
			},
			editLink: {
				baseUrl: "https://github.com/mglsj/simple-ncert/edit/master/",
			},
			sidebar: [
				{
					label: "Class 12",
					autogenerate: { directory: "class 12" },
				},
			],
		}),
	],
});
