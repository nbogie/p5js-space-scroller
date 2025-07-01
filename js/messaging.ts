let messageQueue: FlashMessage[] = [];

type FlashMessage = {
    text: string;
    durationMillis: number;
    startTimeMillis: number;
};

function flashMessage(text: string, durationMillis: number = 2000) {
    messageQueue.push({ text, durationMillis, startTimeMillis: millis() });
}

function drawMessages() {
    const msgsToShow = messageQueue.filter(
        (m) =>
            m.startTimeMillis < millis() &&
            m.startTimeMillis + m.durationMillis > millis(),
    );
    for (const msg of msgsToShow) {
        push();
        const alpha = map(
            millis() - msg.startTimeMillis,
            0,
            msg.durationMillis,
            0,
            255,
        );
        fill(255, alpha);
        textAlign(CENTER);
        textSize(24);
        text(msg.text, width / 2, height - 50);
        pop();
    }
}

function updateMessages() {
    messageQueue = messageQueue.filter((msg) => {
        return millis() - msg.startTimeMillis < msg.durationMillis;
    });
}
