import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";
import remarkMath from "remark-math";
import remarkCustomHeaderId from "remark-custom-header-id";
import rehypeKatex from "rehype-katex";
import rehypeMermaid from "rehype-mermaid";

// https://astro.build/config
export default defineConfig({
	markdown: {
		remarkPlugins: [remarkMath, remarkCustomHeaderId],
		rehypePlugins: [
			rehypeKatex,
			[rehypeMermaid, { strategy: "img-svg", dark: true }],
		],
	},
	site: "https://mglsj.github.io/",
	base: "/simple-ncert/",
	integrations: [
		starlight({
			customCss: [
				"@fontsource-variable/noto-serif-devanagari",
				"@fontsource-variable/noto-sans-devanagari",
				"@fontsource-variable/noto-sans",
				"@fontsource-variable/noto-serif",
				"@/styles/global.css",
			],
			title: {
				en: "Simple NCERT",
				hi: "सरल एनसीईआरटी",
			},
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
			defaultLocale: "root",
			locales: {
				root: {
					label: "English",
					lang: "en",
				},
				hi: {
					label: "हिन्दी",
					lang: "hi",
				},
			},
			sidebar: [
				{
					label: "Class 12",
					translations: {
						hi: "कक्षा 12",
					},
					autogenerate: { directory: "class 12" },
				},
				{
					label: "Class 11",
					translations: {
						hi: "कक्षा 11",
					},
					autogenerate: { directory: "class 11" },
				},
			],
		}),
	],
});
