



export const formatDate = (date) => {
    const hours = new Date(date).getHours();
    const minutes = new Date(date).getMinutes();
    return `${hours < 10 ? '0' + hours : hours}:${minutes < 10 ? '0' + minutes : minutes}`;
}

export const formatJoinedDate = (date) => {
    const value = new Date(date);

    if (Number.isNaN(value.getTime())) return '';

    return value.toLocaleDateString(undefined, {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
    });
}

export const getProfilePictureUrl = (user, fallback) => {
    const picture = [
        user?.picture,
        user?.profilePicture,
        user?.avatar,
        user?.photo,
        user?.imageUrl
    ].find((value) => typeof value === 'string' && value.trim());

    return picture || fallback;
}

export const setFallbackImage = (event, fallback) => {
    const image = event.currentTarget;

    if (image.src !== fallback) {
        image.src = fallback;
    }
}

export const downloadMedia = async (e, originalImage) => {
    e.preventDefault();
    try {
        fetch(originalImage)
            .then(resp => resp.blob())
            .then(blob => {
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.style.display = 'none';
                a.href = url;
                const nameSplit = originalImage.split("/");
                const duplicateName = nameSplit.pop();

                a.download = "" + duplicateName + "";
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
            })
            .catch((error) => console.log('Error while downloading the image ', error))

    } catch (error) {
        console.log('Error while downloading the image ', error);
    }
}
