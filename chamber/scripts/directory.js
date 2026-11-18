const gridContainer = document.querySelector("#business-grid");
const listContainer = document.querySelector("#business-list");
const gridButton = document.querySelector("#grid-button");
const listButton = document.querySelector("#list-button");

function createMemberCard(member) {
    const card = document.createElement("article");
    card.className = "business-card";

    const heading = document.createElement("h2");
    heading.textContent = member.name;

    const tagline = document.createElement("p");
    tagline.className = "tagline";
    tagline.textContent = member.tagline;

    const details = document.createElement("div");
    details.className = "card-details";

    const image = document.createElement("img");
    image.className = "member-image";
    image.src = `images/members/${member.img}`;
    image.alt = `${member.name} logo`;
    image.loading = "lazy";

    const info = document.createElement("div");
    info.className = "member-info";

    const address = document.createElement("p");
    address.innerHTML = `<strong>ADDRESS:</strong> `;
    address.append(document.createTextNode(member.address));

    const email = document.createElement("p");
    email.innerHTML = `<strong>EMAIL:</strong> `;
    const emailLink = document.createElement("a");
    emailLink.href = `mailto:${member.email}`;
    emailLink.textContent = member.email;
    email.append(emailLink);

    const phone = document.createElement("p");
    phone.innerHTML = `<strong>PHONE:</strong> `;
    phone.append(document.createTextNode(member.phone));

    const website = document.createElement("p");
    const websiteLabel = document.createElement("strong");
    websiteLabel.textContent = "URL: ";
    const websiteLink = document.createElement("a");
    websiteLink.href = member.url;
    websiteLink.textContent = member.url;
    websiteLink.target = "_blank";
    websiteLink.rel = "noopener noreferrer";
    website.append(websiteLabel, websiteLink);

    const membership = document.createElement("p");
    membership.className = "membership";
    membership.textContent = `${["", "Member", "Silver", "Gold"][member.level]} membership`;

    info.append(email, phone, website, address, membership);
    details.append(image, info);
    card.append(heading, tagline, details);

    return card;
}

function setView(view) {
    const showGrid = view === "grid";
    gridContainer.hidden = !showGrid;
    listContainer.hidden = showGrid;
    gridButton.classList.toggle("selected", showGrid);
    listButton.classList.toggle("selected", !showGrid);
}

gridButton.addEventListener("click", () => setView("grid"));
listButton.addEventListener("click", () => setView("list"));

async function loadMembers() {
    try {
        const response = await fetch("data/members.json");
        if (!response.ok) {
            throw new Error(response.status);
        }

        const members = await response.json();
        gridContainer.replaceChildren();
        listContainer.replaceChildren();

        members.forEach((member) => {
            gridContainer.append(createMemberCard(member));
            listContainer.append(createMemberCard(member));
        });
    } catch (error) {
        gridContainer.textContent = "Loading Error";
        console.error(error);
    }
}

loadMembers();
