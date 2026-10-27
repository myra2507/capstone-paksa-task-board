// Demo-user picker (PRD §11). This is NOT authentication: anyone can choose
// any member. The choice is remembered in localStorage across refreshes.

const CURRENT_MEMBER_KEY = "clubHub.currentMemberId";

// Returns the chosen member, or null if nobody is chosen or the saved
// member is no longer on the roster (the stale choice is cleared).
function getCurrentMember() {
  const savedId = Number(localStorage.getItem(CURRENT_MEMBER_KEY));
  if (!savedId) {
    return null;
  }
  const member = findMember(savedId);
  if (!member) {
    localStorage.removeItem(CURRENT_MEMBER_KEY);
    return null;
  }
  return member;
}

function setCurrentMemberId(memberId) {
  if (memberId) {
    localStorage.setItem(CURRENT_MEMBER_KEY, String(memberId));
  } else {
    localStorage.removeItem(CURRENT_MEMBER_KEY);
  }
}

function isOfficer(member) {
  return Boolean(member) && member.role === "officer";
}

function roleLabel(member) {
  return member.role === "officer" ? "Officer" : "Member";
}

function memberName(memberId) {
  const member = findMember(memberId);
  return member ? member.name : "Unknown member";
}

function showStorageNotice() {
  const notice = document.getElementById("storage-notice");
  if (storageNotice) {
    notice.textContent = storageNotice;
    notice.hidden = false;
  }
}
