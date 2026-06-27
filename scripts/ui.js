export function bindDropZoneEvents(app) {
    const {
        dropZone,
        dropOverlay,
        bottomFileInput,
        processFile
    } = app;
    let dragDepth = 0;

    function isFileDrag(event) {
        return Array.from(event.dataTransfer?.types || []).includes("Files");
    }

    function setDropHintVisible(isVisible) {
        document.body.classList.toggle("file-drag-active", isVisible);
        dropZone.classList.toggle("dragover", isVisible);
        if (dropOverlay) {
            dropOverlay.classList.toggle("visible", isVisible);
        }
    }

    dropZone.addEventListener("click", () => bottomFileInput.click());

    bottomFileInput.addEventListener("change", (event) => {
        if (event.target.files.length > 0) {
            processFile(event.target.files[0]);
        }
    });

    dropZone.addEventListener("dragover", (event) => {
        event.preventDefault();
        if (event.dataTransfer) {
            event.dataTransfer.dropEffect = "copy";
        }
        setDropHintVisible(true);
    });

    dropZone.addEventListener("dragleave", () => {
        if (dragDepth === 0) {
            setDropHintVisible(false);
        }
    });

    dropZone.addEventListener("drop", (event) => {
        event.preventDefault();
        event.stopPropagation();
        dragDepth = 0;
        setDropHintVisible(false);
        if (event.dataTransfer.files.length > 0) {
            processFile(event.dataTransfer.files[0]);
        }
    });

    document.addEventListener("dragenter", (event) => {
        if (!isFileDrag(event)) {
            return;
        }
        dragDepth += 1;
        setDropHintVisible(true);
    });

    document.addEventListener("dragover", (event) => {
        if (!isFileDrag(event)) {
            return;
        }
        event.preventDefault();
        if (event.dataTransfer) {
            event.dataTransfer.dropEffect = "copy";
        }
        setDropHintVisible(true);
    });

    document.addEventListener("dragleave", (event) => {
        if (!isFileDrag(event)) {
            return;
        }
        dragDepth = Math.max(0, dragDepth - 1);
        if (dragDepth === 0) {
            setDropHintVisible(false);
        }
    });

    document.addEventListener("drop", (event) => {
        if (!isFileDrag(event)) {
            return;
        }
        if (event.target instanceof Node && dropZone.contains(event.target)) {
            return;
        }
        event.preventDefault();
        dragDepth = 0;
        setDropHintVisible(false);
        if (event.dataTransfer.files.length > 0) {
            processFile(event.dataTransfer.files[0]);
        }
    });

    window.addEventListener("dragend", () => {
        dragDepth = 0;
        setDropHintVisible(false);
    });
}

export function bindCanvasDragEvents(app) {
    const { canvas } = app;

    canvas.addEventListener("pointerdown", (event) => {
        app.isDragging = true;
        app.startX = event.clientX;
        app.startY = event.clientY;
        canvas.setPointerCapture(event.pointerId);
    });

    canvas.addEventListener("pointermove", (event) => {
        if (!app.isDragging) {
            return;
        }

        const dx = event.clientX - app.startX;
        const dy = event.clientY - app.startY;
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;

        app.offsetX += dx * scaleX;
        app.offsetY += dy * scaleY;
        app.startX = event.clientX;
        app.startY = event.clientY;
        app.draw();
    });

    canvas.addEventListener("pointerup", (event) => {
        app.isDragging = false;
        canvas.releasePointerCapture(event.pointerId);
    });

    canvas.addEventListener("pointercancel", () => {
        app.isDragging = false;
    });
}
