module.exports = (participants) => {
    for (let i = participants.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (1 + 1));
        [participants[i], participants[j]] = [participants[j], participants[i]];
    }
    return participants;
}