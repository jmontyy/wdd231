const spotlightContainer = document.querySelector("#spotlights");

function createSpotlight(member) {
    const card = document.createElement("article");
    card.className = "spotlight-card";

    const heading = document.createElement("h3");
    heading.textContent = member.name;

    const image = document.createElement("img");
    image.className = "spotlight-logo";
    image.src = `images/members/${member.img}`;
    image.alt = `${member.name} logo`;
    image.loading = "lazy";

    const info = document.createElement("div");
    info.className = "spotlight-info";

    const phone = document.createElement("p");
    phone.innerHTML = "<strong>PHONE:</strong> ";
    phone.append(document.createTextNode(member.phone));

    const address = document.createElement("p");
    address.innerHTML = "<strong>ADDRESS:</strong> ";
    address.append(document.createTextNode(member.address));

    const website = document.createElement("p");
    website.innerHTML = "<strong>WEBSITE:</strong> ";
    const link = document.createElement("a");
    link.href = member.url;
    link.textContent = member.url.replace(/^https?:\/\//, "").replace(/\/$/, "");
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    website.append(link);

    const membership = document.createElement("span");
    membership.className = "spotlight-level";
    membership.textContent = `${member.level === 3 ? "Gold" : "Silver"} Member`;

    info.append(phone, address, website);
    card.append(heading, image, info, membership);
    return card;
}

function shuffle(items) {
    const shuffled = [...items];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

async function loadSpotlights() {
    try {
        const response = await fetch("data/members.json");
        if (!response.ok) throw new Error(`Unable to load member data (${response.status})`);
        const members = await response.json();
        const eligibleMembers = members.filter((member) => member.level === 2 || member.level === 3);
        const selectedMembers = shuffle(eligibleMembers).slice(0, 3);
        spotlightContainer.replaceChildren(...selectedMembers.map(createSpotlight));
    } catch (error) {
        console.error("Spotlight loading error:", error);
        spotlightContainer.textContent = "Member spotlights are unavailable right now.";
    }
}

loadSpotlights();
