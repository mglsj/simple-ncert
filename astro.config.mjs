import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";

// https://astro.build/config
export default defineConfig({
	markdown: {
		remarkPlugins: [remarkMath],
		rehypePlugins: [rehypeKatex],
	},
	site: "https://mglsj.github.io/",
	base: "/simple-ncert/",
	integrations: [
		starlight({
			customCss: ["@/styles/global.css"],
			title: "Simple NCERT",
			social: {
				github: "https://github.com/mglsj/simple-ncert",
			},
			editLink: {
				baseUrl: "https://github.com/mglsj/simple-ncert/edit/main/",
			},
			tableOfContents: {
				minHeadingLevel: 2,
				maxHeadingLevel: 5,
			},
			components: {
				Head: "@/components/Head.astro",
			},
		}),
	],
});
