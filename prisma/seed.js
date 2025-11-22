"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const db2023 = {
    "NL AD6-1250A": { dt: "1.519,13", ut: "1.359,65", nva: "159,48", kd: "0,895", ke: "0,673", ker: "0,723", otr: "2100,31", tsr: "290382,902", ksr: "0,723" },
    "NL AD6-2500A": { dt: "1.384,64", ut: "1.244,38", nva: "140,25", kd: "0,898", ke: "0,673", ker: "0,723", otr: "1914,37", tsr: "290382,902", ksr: "0,723" },
    "NL CL6-1250A": { dt: "1.328,46", ut: "1.199,44", nva: "129,02", kd: "0,902", ke: "0,673", ker: "0,723", otr: "1836,69", tsr: "290382,902", ksr: "0,723" },
    "NL GL6-1250A": { dt: "1.292,90", ut: "1.171,16", nva: "121,74", kd: "0,905", ke: "0,673", ker: "0,723", otr: "1787,53", tsr: "290382,902", ksr: "0,723" },
    "XE AD6-1250A": { dt: "1.316,73", ut: "632,02", nva: "684,71", kd: "0,479", ke: "0,673", ker: "0,723", otr: "1820,48", tsr: "290382,902", ksr: "0,723" },
    "XE TT6-1250A": { dt: "994,25", ut: "13,44", nva: "980,81", kd: "0,013", ke: "0,673", ker: "0,723", otr: "1374,62", tsr: "290382,902", ksr: "0,723" },
};
const db2024 = {
    "XE AD6-1250A": { dt: "1308,4", ut: "937,45", nva: "370,95", kd: "0,716", ke: "0,733", ker: "0,783", otr: "1669,14", tsr: "#DIV/0!", ksr: "" },
    "XE AD6-2500A": { dt: "1338,4", ut: "967,45", nva: "370,95", kd: "0,722", ke: "0,733", ker: "0,783", otr: "1707,41", tsr: "#DIV/0!", ksr: "" },
    "NL GL6-1250A": { dt: "1.345,72", ut: "975,36", nva: "370,36", kd: "0,725", ke: "0,755", ker: "0,805", otr: "1671,72", tsr: "#DIV/0!", ksr: "" },
};
const db2025 = {
    "XE AD6-1250A": { dt: "1.335,40", ut: "944,45", nva: "390,95", kd: "0,707", ke: "0,755", ker: "0,805", otr: "1658,9", tsr: "#DIV/0!", ksr: "" },
    "XE GL6-1250A": { dt: "1.307,62", ut: "935,13", nva: "372,49", kd: "0,715", ke: "0,755", ker: "0,805", otr: "1624,39", tsr: "#DIV/0!", ksr: "" },
};
const ALL_DB = { '2023': db2023, '2024': db2024, '2025': db2025 };
function parseValue(val) {
    if (!val || val === "#DIV/0!")
        return null;
    // Remove thousands separator (.) and replace decimal separator (,) with (.)
    // Example: "1.519,13" -> "1519.13"
    // Example: "0,895" -> "0.895"
    // Example: "1308,4" -> "1308.4"
    // First remove all dots (thousands separators)
    let clean = val.replace(/\./g, '');
    // Then replace comma with dot
    clean = clean.replace(',', '.');
    const num = parseFloat(clean);
    return isNaN(num) ? null : num;
}
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        for (const yearStr of Object.keys(ALL_DB)) {
            const year = parseInt(yearStr);
            const products = ALL_DB[yearStr];
            for (const productName of Object.keys(products)) {
                const data = products[productName];
                // Find or create product
                const product = yield prisma.product.upsert({
                    where: { name: productName },
                    update: {},
                    create: { name: productName },
                });
                // Create YearData
                yield prisma.yearData.upsert({
                    where: {
                        productId_year: {
                            productId: product.id,
                            year: year
                        }
                    },
                    update: {
                        dt: parseValue(data.dt),
                        ut: parseValue(data.ut),
                        nva: parseValue(data.nva),
                        kd: parseValue(data.kd),
                        ke: parseValue(data.ke),
                        ker: parseValue(data.ker),
                        ksr: parseValue(data.ksr),
                        otr: parseValue(data.otr),
                        tsr: data.tsr,
                    },
                    create: {
                        productId: product.id,
                        year: year,
                        dt: parseValue(data.dt),
                        ut: parseValue(data.ut),
                        nva: parseValue(data.nva),
                        kd: parseValue(data.kd),
                        ke: parseValue(data.ke),
                        ker: parseValue(data.ker),
                        ksr: parseValue(data.ksr),
                        otr: parseValue(data.otr),
                        tsr: data.tsr,
                    }
                });
            }
        }
        console.log('Seeding finished.');
    });
}
main()
    .then(() => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma.$disconnect();
}))
    .catch((e) => __awaiter(void 0, void 0, void 0, function* () {
    console.error(e);
    yield prisma.$disconnect();
    process.exit(1);
}));
