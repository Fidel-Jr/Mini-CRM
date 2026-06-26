import packageJson from "../../package.json";

const currentYear = new Date().getFullYear();

export const APP_CONFIG = {
  name: "Mini CRM",
  version: packageJson.version,
  copyright: `© ${currentYear}, Studio Admin.`,
  meta: {
    title: "Mini CRM - AI knowledge assistant",
    description:
      "A small CRM for managing customers and sales opportunities, enhanced with an AI knowledge assistant powered by company documents.",
  },
};
