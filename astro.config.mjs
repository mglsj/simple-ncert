import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";
import starlightSidebarTopicsDropdown from "starlight-sidebar-topics-dropdown";
import remarkMath from "remark-math";
import remarkCustomHeaderId from "remark-custom-header-id";
import rehypeKatex from "rehype-katex";
import rehypeMermaid from "rehype-mermaid";
import starlightImageZoom from "starlight-image-zoom";

import sidebarData from "./sidebar.ts";

// https://astro.build/config
export default defineConfig({
	markdown: {
		remarkPlugins: [remarkMath, remarkCustomHeaderId],
		rehypePlugins: [
			rehypeKatex,
			[
				rehypeMermaid,
				{ strategy: "img-svg", dark: true, colorScheme: "light" },
			],
		],
	},
	site: "https://mglsj.github.io/",
	base: "/simple-ncert/",
	integrations: [
		starlight({
			head: [
				{
					tag: "link",
					attrs: {
						rel: "stylesheet",
						href: "https://cdn.jsdelivr.net/npm/katex@0.15.2/dist/katex.min.css",
						integrity:
							"sha384-MlJdn/WNKDGXveldHDdyRP1R4CTHr3FeuDNfhsLPYrq2t0UBkUdK2jyTnXPEK1NQ",
						crossorigin: "anonymous",
					},
				},
			],
			customCss: [
				"@fontsource-variable/noto-serif-devanagari",
				"@fontsource-variable/noto-sans-devanagari",
				"@fontsource-variable/noto-sans",
				"@fontsource-variable/noto-serif",
				"@/styles/global.css",
			],
			components: {
				PageTitle: "@/components/starlight/PageTitle.astro",
			},
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
			plugins: [
				starlightImageZoom(),
				starlightSidebarTopicsDropdown(sidebarData),
			],
		}),
	],
});
