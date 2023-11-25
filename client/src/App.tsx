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

function App() {
	const [photos, setPhotos] = useState<Photo[]>([]);
	const nextPhotoURLRef = useRef<string>();
	const imageRef = useCallback((image : HTMLImageElement) => {
        if (image == null) return;
		const observer = new IntersectionObserver((entries) => {
			if (entries[0].isIntersecting) {
				fetchPhotos(nextPhotoURLRef.current, { overwrite: false });
				observer.unobserve(image);
			}
		});
		observer.observe(image);
	}, []);

	function fetchPhotos(url?: string, { overwrite = false } = {}) {
		if (!url) return;
		baseURL.get(url).then((res) => {
			if (res.headers == null) return;
			if (typeof res.headers.get === "function") {
				nextPhotoURLRef.current = parseLinkHeader(
					res.headers.get("link")
				)?.next;
			}\
			const photos = res.data;
            console.log(photos)
			if (overwrite) setPhotos(photos);
			else {
				setPhotos((p) => [...p, ...photos]);
			}
		});
	}

	useEffect(() => {
		fetchPhotos("/photos?_page=1&_limit=10", { overwrite: true });
	}, []);

	return (
		<div className="grid p-2 mx-auto grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-4">
			{photos.map((photo, index) => (
				<img
					key={photo.id}
					src={photo.url}
					ref={photos.length - 1 == index ? imageRef : undefined}
					className="mx-auto"
				/>
			))}
		</div>
	);
}

export default App;
