export const hideEmail = (email: string): string => {
    const [username, rest] = email.split('@');
    const [domain, extension] = rest.split('.');

    const hiddenUsername = username.charAt(0) + '*'.repeat(username.length - 2) + username.charAt(username.length - 1);
    const hiddenDomain = domain.charAt(0) + '*'.repeat(domain.length - 1) + domain.charAt(domain.length - 1);
    const hiddenExtension =
        extension.charAt(0) + '*'.repeat(extension.length - 1) + extension.charAt(extension.length - 1);

    return `${hiddenUsername}@${hiddenDomain}.${hiddenExtension}`;
};
