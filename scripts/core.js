export function getBottomDrawSize(app) {
    const {
        canvas,
        bottomImg,
        fitMode,
        bottomScale
    } = app;

    if (!(bottomImg.src && bottomImg.complete && bottomImg.naturalWidth > 0)) {
        return null;
    }

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
    return { drawWidth, drawHeight };
}

export function centerBottomImage(app) {
    const size = getBottomDrawSize(app);
    if (!size) {
        app.offsetX = 0;
        app.offsetY = 0;
        return;
    }

    app.offsetX = (app.canvas.width - size.drawWidth) / 2;
    app.offsetY = (app.canvas.height - size.drawHeight) / 2;
}

export function drawCanvas(app) {
    const {
        ctx,
        canvas,
        topImg,
        bottomImg,
        offsetX,
        offsetY
    } = app;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const bottomSize = getBottomDrawSize(app);
    if (bottomSize) {
        ctx.drawImage(bottomImg, offsetX, offsetY, bottomSize.drawWidth, bottomSize.drawHeight);
    }

    if (topImg.src && topImg.complete && topImg.naturalWidth > 0) {
        ctx.drawImage(topImg, 0, 0, canvas.width, canvas.height);
    }
}
