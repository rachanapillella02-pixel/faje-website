/** Indian postal PIN: 6 digits, first digit 1–9 (not 000000). */
export const IN_PINCODE_REGEX = /^[1-9][0-9]{5}$/;

export function isValidIndianPincode(pin: string): boolean {
    return IN_PINCODE_REGEX.test(pin.trim());
}

/**
 * Lowercase legacy / informal names → canonical state/UT name in INDIAN_STATES_AND_UTS.
 * Lets users search "orissa", "pondicherry", "uttaranchal" and still resolve a valid state.
 */
const STATE_ALIAS_TO_CANONICAL: Readonly<Record<string, string>> = {
    orissa: 'Odisha',
    pondicherry: 'Puducherry',
    puducherry: 'Puducherry',
    uttaranchal: 'Uttarakhand',
};

/** States + union territories (official names for shipping forms). */
export const INDIAN_STATES_AND_UTS: readonly string[] = [
    'Andaman and Nicobar Islands',
    'Andhra Pradesh',
    'Arunachal Pradesh',
    'Assam',
    'Bihar',
    'Chandigarh',
    'Chhattisgarh',
    'Dadra and Nagar Haveli and Daman and Diu',
    'Delhi',
    'Goa',
    'Gujarat',
    'Haryana',
    'Himachal Pradesh',
    'Jammu and Kashmir',
    'Jharkhand',
    'Karnataka',
    'Kerala',
    'Ladakh',
    'Lakshadweep',
    'Madhya Pradesh',
    'Maharashtra',
    'Manipur',
    'Meghalaya',
    'Mizoram',
    'Nagaland',
    'Odisha',
    'Puducherry',
    'Punjab',
    'Rajasthan',
    'Sikkim',
    'Tamil Nadu',
    'Telangana',
    'Tripura',
    'Uttar Pradesh',
    'Uttarakhand',
    'West Bengal',
].sort((a, b) => a.localeCompare(b, 'en-IN'));

/** Returns canonical name from list, alias map, or null. */
export function normalizeIndianState(state: string): string | null {
    const t = state.trim();
    if (!t) return null;
    const lower = t.toLowerCase();
    const fromAlias = STATE_ALIAS_TO_CANONICAL[lower];
    if (fromAlias) return fromAlias;
    const found = INDIAN_STATES_AND_UTS.find((s) => s.toLowerCase() === lower);
    return found ?? null;
}

export function isValidIndianState(state: string): boolean {
    return normalizeIndianState(state) !== null;
}

function stateMatchesSearchQuery(canonicalName: string, q: string): boolean {
    if (canonicalName.toLowerCase().includes(q)) return true;
    for (const [alias, canon] of Object.entries(STATE_ALIAS_TO_CANONICAL)) {
        if (canon !== canonicalName) continue;
        if (alias.includes(q) || q.includes(alias) || alias.startsWith(q) || q.startsWith(alias)) {
            return true;
        }
    }
    return false;
}

export function filterStatesByQuery(query: string, limit = 12): string[] {
    const q = query.trim().toLowerCase();
    if (!q) return [...INDIAN_STATES_AND_UTS].slice(0, limit);
    return INDIAN_STATES_AND_UTS.filter((s) => stateMatchesSearchQuery(s, q)).slice(0, limit);
}
