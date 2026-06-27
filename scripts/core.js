export function drawCanvas(app) {
    const {
        ctx,
        canvas,
        topImg,
        bottomImg,
        fitMode,
        bottomScale,
        offsetX,
        offsetY
    } = app;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (bottomImg.src && bottomImg.complete && bottomImg.naturalWidth > 0) {
        let drawWidth;
        let drawHeight;

        if (fitMode === "width") {
            const scale = canvas.width / bottomImg.width;
            drawWidth = canvas.width;
            drawHeight = bottomImg.height * scale;
        } else if (fitMode === "height") {
            const scale = canvas.height / bottomImg.height;
            drawWidth = bottomImg.width * scale;
            drawHeight = canvas.height;
        } else {
            const canvasShortSide = Math.min(canvas.width, canvas.height);
            const imageShortSide = Math.min(bottomImg.width, bottomImg.height);
            const scale = canvasShortSide / imageShortSide;
            drawWidth = bottomImg.width * scale;
            drawHeight = bottomImg.height * scale;
        }

        drawWidth *= bottomScale;
        drawHeight *= bottomScale;
        ctx.drawImage(bottomImg, offsetX, offsetY, drawWidth, drawHeight);
    }

    if (topImg.src && topImg.complete && topImg.naturalWidth > 0) {
        ctx.drawImage(topImg, 0, 0, canvas.width, canvas.height);
    }
}
