import { AxiosHeaderValue } from "axios";

export function parseLinkHeader(linkHeader: AxiosHeaderValue) {
	if (!linkHeader) return {};
	if (typeof linkHeader == "string") {
		const links: string[] = linkHeader.split(",");
		const parsedLinks: Record<string, string> = {};
		links.forEach((link) => {
			const urlMatch = link.match(/<(.*)>/);
			const relMatch = link.match(/rel="(.*)"/);
			if (urlMatch && relMatch) {
				const url = urlMatch[1];
				const rel = relMatch[1];
				parsedLinks[rel] = url;
			}
		});
		return parsedLinks;
	}
}
