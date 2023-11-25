import { useCallback, useEffect, useRef, useState } from "react";
import { parseLinkHeader } from "./parseLinkHeader";
import { baseURL } from "./api/base";

type Photo = {
	albumId: number;
	id: number;
	title: string;
	url: string;
	thumbnailUrl: string;
};

export default function App() {
	const [photos, setPhotos] = useState<Photo[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const nextPhotoURLRef = useRef<string>();
	const imageRef = useCallback((image: HTMLImageElement) => {
		if (image == null || nextPhotoURLRef.current == null) return;
		const observer = new IntersectionObserver((entries) => {
			if (entries[0].isIntersecting) {
				fetchPhotos(nextPhotoURLRef.current, { overwrite: false });
				observer.unobserve(image);
			}
		});
		observer.observe(image);
	}, []);

	async function fetchPhotos(url?: string, { overwrite = false } = {}) {
		if (!url) return;
		setIsLoading(true);
		await new Promise((res) => setTimeout(res, 5000));
		try {
			const res = await baseURL.get(url);
			if (res.headers == null) return;
			if (typeof res.headers.get === "function") {
				nextPhotoURLRef.current = parseLinkHeader(
					res.headers.get("link")
				)?.next;
			}
			const photos = res.data;
			console.log(photos);
			if (overwrite) setPhotos(photos);
			else {
				setPhotos((p) => [...p, ...photos]);
			}
		} catch (error) {
			console.log(error);
		} finally {
			setIsLoading(false);
		}
	}

	useEffect(() => {
		fetchPhotos("/photos?_page=1&_limit=10", { overwrite: true });
	}, []);

	return (
		<div className="grid p-2 mx-auto  w-full grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-4">
			{photos.map((photo, index) => (
				<img
					key={photo.id}
					src={photo.url}
					ref={photos.length - 1 == index ? imageRef : undefined}
					className="mx-auto flex aspect-square"
				/>
			))}
			{isLoading &&
				Array.from({ length: 10 }, (_, index) => index).map((n) => {
					return (
						<div
							key={n}
							className="bg-gray-300 aspect-square text-gray-400 animate-skeleton flex items-center justify-center text-6xl"
						>
							Loading...
						</div>
					);
				})}
		</div>
	);
}
