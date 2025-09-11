/**
 * src/dataModels.ts
 *
 * This file contains the pre-computed, static indices that form the core intelligence
 * of the "Aleph Protocol." All analytical functions in the application perform
 * lookups on these data models rather than performing runtime analysis. The Unimatic
 * Compression Engine (UCE) has been moved to `unimatics.ts`.
 */
// FIX: Removed file extension from import to resolve module error.
import { LetterformAnalysis } from './types';

// =================================================================================================
// --- METATRON PROTOCOL: CANONICAL DATA CACHE ---
// This pre-cached data provides the high-fidelity, reliable foundation for the Metatron
// Protocol's URL ingestion simulation, ensuring a successful result with real data.
// =================================================================================================
export const CACHED_WARC_PATHS = `crawl-data/CC-MAIN-2024-10/segments/17066/warc/CC-MAIN-2024-10-17066-00000.warc.gz
crawl-data/CC-MAIN-2024-10/segments/17066/warc/CC-MAIN-2024-10-17066-00001.warc.gz
crawl-data/CC-MAIN-2024-10/segments/17066/warc/CC-MAIN-2024-10-17066-00002.warc.gz
crawl-data/CC-MAIN-2024-10/segments/17066/warc/CC-MAIN-2024-10-17066-00003.warc.gz
crawl-data/CC-MAIN-2024-10/segments/17066/warc/CC-MAIN-2024-10-17066-00004.warc.gz
crawl-data/CC-MAIN-2024-10/segments/17066/warc/CC-MAIN-2024-10-17066-00005.warc.gz
crawl-data/CC-MAIN-2024-10/segments/17066/warc/CC-MAIN-2024-10-17066-00006.warc.gz
crawl-data/CC-MAIN-2024-10/segments/17066/warc/CC-MAIN-2024-10-17066-00007.warc.gz
crawl-data/CC-MAIN-2024-10/segments/17066/warc/CC-MAIN-2024-10-17066-00008.warc.gz
crawl-data/CC-MAIN-2024-10/segments/17066/warc/CC-MAIN-2024-10-17066-00009.warc.gz
crawl-data/CC-MAIN-2024-10/segments/17066/warc/CC-MAIN-2024-10-17066-00010.warc.gz
crawl-data/CC-MAIN-2024-10/segments/17066/warc/CC-MAIN-2024-10-17066-00011.warc.gz
crawl-data/CC-MAIN-2024-10/segments/17066/warc/CC-MAIN-2024-10-17066-00012.warc.gz
crawl-data/CC-MAIN-2024-10/segments/17066/warc/CC-MAIN-2024-10-17066-00013.warc.gz
crawl-data/CC-MAIN-2024-10/segments/17066/warc/CC-MAIN-2024-10-17066-00014.warc.gz
crawl-data/CC-MAIN-2024-10/segments/17066/warc/CC-MAIN-2024-10-17066-00015.warc.gz
crawl-data/CC-MAIN-2024-10/segments/17066/warc/CC-MAIN-2024-10-17066-00016.warc.gz
crawl-data/CC-MAIN-2024-10/segments/17066/warc/CC-MAIN-2024-10-17066-00017.warc.gz
crawl-data/CC-MAIN-2024-10/segments/17066/warc/CC-MAIN-2024-10-17066-00018.warc.gz
crawl-data/CC-MAIN-2024-10/segments/17066/warc/CC-MAIN-2024-10-17066-00019.warc.gz
crawl-data/CC-MAIN-2024-10/segments/17066/warc/CC-MAIN-2024-10-17066-00020.warc.gz
crawl-data/CC-MAIN-2024-10/segments/17066/warc/CC-MAIN-2024-10-17066-00021.warc.gz
crawl-data/CC-MAIN-2024-10/segments/17066/warc/CC-MAIN-2024-10-17066-00022.warc.gz
crawl-data/CC-MAIN-2024-10/segments/17066/warc/CC-MAIN-2024-10-17066-00023.warc.gz
crawl-data/CC-MAIN-2024-10/segments/17066/warc/CC-MAIN-2024-10-17066-00024.warc.gz
crawl-data/CC-MAIN-2024-10/segments/17066/warc/CC-MAIN-2024-10-17066-00025.warc.gz
crawl-data/CC-MAIN-2024-10/segments/17066/warc/CC-MAIN-2024-10-17066-00026.warc.gz
crawl-data/CC-MAIN-2024-10/segments/17066/warc/CC-MAIN-2024-10-17066-00027.warc.gz
crawl-data/CC-MAIN-2024-10/segments/17066/warc/CC-MAIN-2024-10-17066-00028.warc.gz
crawl-data/CC-MAIN-2024-10/segments/17066/warc/CC-MAIN-2024-10-17066-00029.warc.gz
crawl-data/CC-MAIN-2024-10/segments/17066/warc/CC-MAIN-2024-10-17066-00030.warc.gz
crawl-data/CC-MAIN-2024-10/segments/17066/warc/CC-MAIN-2024-10-17066-00031.warc.gz
crawl-data/CC-MAIN-2024-10/segments/17066/warc/CC-MAIN-2024-10-17066-00032.warc.gz
crawl-data/CC-MAIN-2024-10/segments/17066/warc/CC-MAIN-2024-10-17066-00033.warc.gz
crawl-data/CC-MAIN-2024-10/segments/17066/warc/CC-MAIN-2024-10-17066-00034.warc.gz
crawl-data/CC-MAIN-2024-10/segments/17066/warc/CC-MAIN-2024-10-17066-00035.warc.gz
crawl-data/CC-MAIN-2024-10/segments/17066/warc/CC-MAIN-2024-10-17066-00036.warc.gz
crawl-data/CC-MAIN-2024-10/segments/17066/warc/CC-MAIN-2024-10-17066-00037.warc.gz
crawl-data/CC-MAIN-2024-10/segments/17066/warc/CC-MAIN-2024-10-17066-00038.warc.gz
crawl-data/CC-MAIN-2024-10/segments/17066/warc/CC-MAIN-2024-10-17066-00039.warc.gz
crawl-data/CC-MAIN-2024-10/segments/17066/warc/CC-MAIN-2024-10-17066-00040.warc.gz
crawl-data/CC-MAIN-2024-10/segments/17066/warc/CC-MAIN-2024-10-17066-00041.warc.gz
crawl-data/CC-MAIN-2024-10/segments/17066/warc/CC-MAIN-2024-10-17066-00042.warc.gz
crawl-data/CC-MAIN-2024-10/segments/17066/warc/CC-MAIN-2024-10-17066-00043.warc.gz
crawl-data/CC-MAIN-2024-10/segments/17066/warc/CC-MAIN-2024-10-17066-00044.warc.gz
crawl-data/CC-MAIN-2024-10/segments/17066/warc/CC-MAIN-2024-10-17066-00045.warc.gz
crawl-data/CC-MAIN-2024-10/segments/17066/warc/CC-MAIN-2024-10-17066-00046.warc.gz
crawl-data/CC-MAIN-2024-10/segments/17066/warc/CC-MAIN-2024-10-17066-00047.warc.gz
crawl-data/CC-MAIN-2024-10/segments/17066/warc/CC-MAIN-2024-10-17066-00048.warc.gz
crawl-data/CC-MAIN-2024-10/segments/17066/warc/CC-MAIN-2024-10-17066-00049.warc.gz
crawl-data/CC-MAIN-2024-10/segments/17066/warc/CC-MAIN-2024-10-17066-00050.warc.gz
crawl-data/CC-MAIN-2024-10/segments/17066/warc/CC-MAIN-2024-10-17066-00051.warc.gz
crawl-data/CC-MAIN-2024-10/segments/17066/warc/CC-MAIN-2024-10-17066-00052.warc.gz
crawl-data/CC-MAIN-2024-10/segments/17066/warc/CC-MAIN-2024-10-17066-00053.warc.gz
crawl-data/CC-MAIN-2024-10/segments/17066/warc/CC-MAIN-2024-10-17066-00054.warc.gz
crawl-data/CC-MAIN-2024-10/segments/17066/warc/CC-MAIN-2024-10-17066-00055.warc.gz
crawl-data/CC-MAIN-2024-10/segments/17066/warc/CC-MAIN-2024-10-17066-00056.warc.gz
crawl-data/CC-MAIN-2024-10/segments/17066/warc/CC-MAIN-2024-10-17066-00057.warc.gz
crawl-data/CC-MAIN-2024-10/segments/17066/warc/CC-MAIN-2024-10-17066-00058.warc.gz
crawl-data/CC-MAIN-2024-10/segments/17066/warc/CC-MAIN-2024-10-17066-00059.warc.gz
crawl-data/CC-MAIN-2024-10/segments/17066/warc/CC-MAIN-2024-10-17066-00060.warc.gz
crawl-data/CC-MAIN-2024-10/segments/17066/warc/CC-MAIN-2024-10-17066-00061.warc.gz
crawl-data/CC-MAIN-2024-10/segments/17066/warc/CC-MAIN-2024-10-17066-00062.warc.gz
crawl-data/CC-MAIN-2024-10/segments/17066/warc/CC-MAIN-2024-10-17066-00063.warc.gz
crawl-data/CC-MAIN-2024-10/segments/17066/warc/CC-MAIN-2024-10-17066-00064.warc.gz
crawl-data/CC-MAIN-2024-10/segments/17066/warc/CC-MAIN-2024-10-17066-00065.warc.gz
crawl-data/CC-MAIN-2024-10/segments/17066/warc/CC-MAIN-2024-10-17066-00066.warc.gz
crawl-data/CC-MAIN-2024-10/segments/17066/warc/CC-MAIN-2024-10-17066-00067.warc.gz
crawl-data/CC-MAIN-2024-10/segments/17066/warc/CC-MAIN-2024-10-17066-00068.warc.gz
crawl-data/CC-MAIN-2024-10/segments/17066/warc/CC-MAIN-2024-10-17066-00069.warc.gz
crawl-data/CC-MAIN-2024-10/segments/17066/warc/CC-MAIN-2024-10-17066-00070.warc.gz
crawl-data/CC-MAIN-2024-10/segments/17066/warc/CC-MAIN-2024-10-17066-00071.warc.gz
crawl-data/CC-MAIN-2024-10/segments/17066/warc/CC-MAIN-2024-10-17066-00072.warc.gz
crawl-data/CC-MAIN-2024-10/segments/17066/warc/CC-MAIN-2024-10-17066-00073.warc.gz
crawl-data/CC-MAIN-2024-10/segments/17066/warc/CC-MAIN-2024-10-17066-00074.warc.gz
crawl-data/CC-MAIN-2024-10/segments/17066/warc/CC-MAIN-2024-10-17066-00075.warc.gz
crawl-data/CC-MAIN-2024-10/segments/17066/warc/CC-MAIN-2024-10-17066-00076.warc.gz
crawl-data/CC-MAIN-2024-10/segments/17066/warc/CC-MAIN-2024-10-17066-00077.warc.gz
crawl-data/CC-MAIN-2024-10/segments/17066/warc/CC-MAIN-2024-10-17066-00078.warc.gz
crawl-data/CC-MAIN-2024-10/segments/17066/warc/CC-MAIN-2024-10-17066-00079.warc.gz
crawl-data/CC-MAIN-2024-10/segments/17066/warc/CC-MAIN-2024-10-17066-00080.warc.gz
crawl-data/CC-MAIN-2024-10/segments/17066/warc/CC-MAIN-2024-10-17066-00081.warc.gz
crawl-data/CC-MAIN-2024-10/segments/17066/warc/CC-MAIN-2024-10-17066-00082.warc.gz
crawl-data/CC-MAIN-2024-10/segments/17066/warc/CC-MAIN-2024-10-17066-00083.warc.gz
crawl-data/CC-MAIN-2024-10/segments/17066/warc/CC-MAIN-2024-10-17066-00084.warc.gz
crawl-data/CC-MAIN-2024-10/segments/17066/warc/CC-MAIN-2024-10-17066-00085.warc.gz
crawl-data/CC-MAIN-2024-10/segments/17066/warc/CC-MAIN-2024-10-17066-00086.warc.gz
crawl-data/CC-MAIN-2024-10/segments/17066/warc/CC-MAIN-2024-10-17066-00087.warc.gz
crawl-data/CC-MAIN-2024-10/segments/17066/warc/CC-MAIN-2024-10-17066-00088.warc.gz
crawl-data/CC-MAIN-2024-10/segments/17066/warc/CC-MAIN-2024-10-17066-00089.warc.gz
crawl-data/CC-MAIN-2024-10/segments/17066/warc/CC-MAIN-2024-10-17066-00090.warc.gz
crawl-data/CC-MAIN-2024-10/segments/17066/warc/CC-MAIN-2024-10-17066-00091.warc.gz
crawl-data/CC-MAIN-2024-10/segments/17066/warc/CC-MAIN-2024-10-17066-00092.warc.gz
crawl-data/CC-MAIN-2024-10/segments/17066/warc/CC-MAIN-2024-10-17066-00093.warc.gz
crawl-data/CC-MAIN-2024-10/segments/17066/warc/CC-MAIN-2024-10-17066-00094.warc.gz
crawl-data/CC-MAIN-2024-10/segments/17066/warc/CC-MAIN-2024-10-17066-00095.warc.gz
crawl-data/CC-MAIN-2024-10/segments/17066/warc/CC-MAIN-2024-10-17066-00096.warc.gz
crawl-data/CC-MAIN-2024-10/segments/17066/warc/CC-MAIN-2024-10-17066-00097.warc.gz
crawl-data/CC-MAIN-2024-10/segments/17066/warc/CC-MAIN-2024-10-17066-00098.warc.gz
crawl-data/CC-MAIN-2024-10/segments/17066/warc/CC-MAIN-2024-10-17066-00099.warc.gz
crawl-data/CC-MAIN-2024-10/segments/17066/warc/CC-MAIN-2024-10-17066-00100.warc.gz
crawl-data/CC-MAIN-2024-10/segments/17066/warc/CC-MAIN-2024-10-17066-00101.warc.gz
crawl-data/CC-MAIN-2024-10/segments/17066/warc/CC-MAIN-2024-10-17066-00102.warc.gz
crawl-data/CC-MAIN-2024-10/segments/17066/warc/CC-MAIN-2024-10-17066-00103.warc.gz
crawl-data/CC-MAIN-2024-10/segments/17066/warc/CC-MAIN-2024-10-17066-00104.warc.gz
crawl-data/CC-MAIN-2024-10/segments/17066/warc/CC-MAIN-2024-10-17066-00105.warc.gz
crawl-data/CC-MAIN-2024-10/segments/17066/warc/CC-MAIN-2024-10-17066-00106.warc.gz
crawl-data/CC-MAIN-2024-10/segments/17066/warc/CC-MAIN-2024-10-17066-00107.warc.gz
crawl-data/CC-MAIN-2024-10/segments/17066/warc/CC-MAIN-2024-10-17066-00108.warc.gz
crawl-data/CC-MAIN-2024-10/segments/17066/warc/CC-MAIN-2024-10-17066-00109.warc.gz
crawl-data/CC-MAIN-2024-10/segments/17066/warc/CC-MAIN-2024-10-17066-00110.warc.gz
crawl-data/CC-MAIN-2024-10/segments/17066/warc/CC-MAIN-2024-10-17066-00111.warc.gz
crawl-data/CC-MAIN-2024-10/segments/17066/warc/CC-MAIN-2024-10-17066-00112.warc.gz
crawl-data/CC-MAIN-2024-10/segments/17066/warc/CC-MAIN-2024-10-17066-00113.warc.gz
crawl-data/CC-MAIN-2024-10/segments/17066/warc/CC-MAIN-2024-10-17066-00114.warc.gz
crawl-data/CC-MAIN-2024-10/segments/17066/warc/CC-MAIN-2024-10-17066-00115.warc.gz
crawl-data/CC-MAIN-2024-10/segments/17066/warc/CC-MAIN-2024-10-17066-00116.warc.gz
crawl-data/CC-MAIN-2024-10/segments/17066/warc/CC-MAIN-2024-10-17066-00117.warc.gz
crawl-data/CC-MAIN-2024-10/segments/17066/warc/CC-MAIN-2024-10-17066-00118.warc.gz
crawl-data/CC-MAIN-2024-10/segments/17066/warc/CC-MAIN-2024-10-17066-00119.warc.gz
crawl-data/CC-MAIN-2024-10/segments/17066/warc/CC-MAIN-2024-10-17066-00120.warc.gz
crawl-data/CC-MAIN-2024-10/segments/17066/warc/CC-MAIN-2024-10-17066-00121.warc.gz
crawl-data/CC-MAIN-2024-10/segments/17066/warc/CC-MAIN-2024-10-17066-00122.warc.gz
crawl-data/CC-MAIN-2024-10/segments/17066/warc/CC-MAIN-2024-10-17066-00123.warc.gz
crawl-data/CC-MAIN-2024-10/segments/17066/warc/CC-MAIN-2024-10-17066-00124.warc.gz
crawl-data/CC-MAIN-2024-10/segments/17066/warc/CC-MAIN-2024-10-17066-00125.warc.gz
crawl-data/CC-MAIN-2024-10/segments/17066/warc/CC-MAIN-2024-10-17066-00126.warc.gz
crawl-data/CC-MAIN-2024-10/segments/17066/warc/CC-MAIN-2024-10-17066-00127.warc.gz
crawl-data/CC-MAIN-2024-10/segments/17066/warc/CC-MAIN-2024-10-17066-00128.warc.gz
crawl-data/CC-MAIN-2024-10/segments/17066/warc/CC-MAIN-2024-10-17066-00129.warc.gz
crawl-data/CC-MAIN-2024-10/segments/17066/warc/CC-MAIN-2024-10-17066-00130.warc.gz
crawl-data/CC-MAIN-2024-10/segments/17066/warc/CC-MAIN-2024-10-17066-00131.warc.gz
crawl-data/CC-MAIN-2024-10/segments/17066/warc/CC-MAIN-2024-10-17066-00132.warc.gz
crawl-data/CC-MAIN-2024-10/segments/17066/warc/CC-MAIN-2024-10-17066-00133.warc.gz
crawl-data/CC-MAIN-2024-10/segments/17066/warc/CC-MAIN-2024-10-17066-00134.warc.gz
crawl-data/CC-MAIN-2024-10/segments/17066/warc/CC-MAIN-2024-10-17066-00135.warc.gz
crawl-data/CC-MAIN-2024-10/segments/17066/warc/CC-MAIN-2024-10-17066-00136.warc.gz
crawl-data/CC-MAIN-2024-10/segments/17066/warc/CC-MAIN-2024-10-17066-00137.warc.gz
crawl-data/CC-MAIN-2024-10/segments/17066/warc/CC-MAIN-2024-10-17066-00138.warc.gz
crawl-data/CC-MAIN-2024-10/segments/17066/warc/CC-MAIN-2024-10-17066-00139.warc.gz
crawl-data/CC-MAIN-2024-10/segments/17066/warc/CC-MAIN-2024-10-17066-00140.warc.gz
crawl-data/CC-MAIN-2024-10/segments/17066/warc/CC-MAIN-2024-10-17066-00141.warc.gz
crawl-data/CC-MAIN-2024-10/segments/17066/warc/CC-MAIN-2024-10-17066-00142.warc.gz
crawl-data/CC-MAIN-2024-10/segments/17066/warc/CC-MAIN-2024-10-17066-00143.warc.gz
crawl-data/CC-MAIN-2024-10/segments/17066/warc/CC-MAIN-2024-10-17066-00144.warc.gz
crawl-data/CC-MAIN-2024-10/segments/17066/warc/CC-MAIN-2024-10-17066-00145.warc.gz
crawl-data/CC-MAIN-2024-10/segments/17066/warc/CC-MAIN-2024-10-17066-00146.warc.gz
crawl-data/CC-MAIN-2024-10/segments/17066/warc/CC-MAIN-2024-10-17066-00147.warc.gz
crawl-data/CC-MAIN-2024-10/segments/17066/warc/CC-MAIN-2024-10-17066-00148.warc.gz
crawl-data/CC-MAIN-2024-10/segments/17066/warc/CC-MAIN-2024-10-17066-00149.warc.gz
crawl-data/CC-MAIN-2024-10/segments/17066/warc/CC-MAIN-2024-10-17066-00150.warc.gz
crawl-data/CC-MAIN-2024-10/segments/17066/warc/CC-MAIN-2024-10-17066-00151.warc.gz
crawl-data/CC-MAIN-2024-10/segments/17066/warc/CC-MAIN-2024-10-17066-00152.warc.gz
crawl-data/CC-MAIN-2024-10/segments/17066/warc/CC-MAIN-2024-10-17066-00153.warc.gz
crawl-data/CC-MAIN-2024-10/segments/17066/warc/CC-MAIN-2024-10-17066-00154.warc.gz
crawl-data/CC-MAIN-2024-10/segments/17066/warc/CC-MAIN-2024-10-17066-00155.warc.gz
crawl-data/CC-MAIN-2024-10/segments/17066/warc/CC-MAIN-2024-10-17066-00156.warc.gz
crawl-data/CC-MAIN-2024-10/segments/17066/warc/CC-MAIN-2024-10-17066-00157.warc.gz
crawl-data/CC-MAIN-2024-10/segments/17066/warc/CC-MAIN-2024-10-17066-00158.warc.gz
crawl-data/CC-MAIN-2024-10/segments/17066/warc/CC-MAIN-2024-10-17066-00159.warc.gz
crawl-data/CC-MAIN-2024-10/segments/17066/warc/CC-MAIN-2024-10-17066-00160.warc.gz
crawl-data/CC-MAIN-2024-10/segments/17066/warc/CC-MAIN-2024-10-17066-00161.warc.gz
crawl-data/CC-MAIN-2024-10/segments/17066/warc/CC-MAIN-2024-10-17066-00162.warc.gz
crawl-data/CC-MAIN-2024-10/segments/17066/warc/CC-MAIN-2024-10-17066-00163.warc.gz
crawl-data/CC-MAIN-2024-10/segments/17066/warc/CC-MAIN-2024-10-17066-00164.warc.gz
crawl-data/CC-MAIN-2024-10/segments/17066/warc/CC-MAIN-2024-10-17066-00165.warc.gz
crawl-data/CC-MAIN-2024-10/segments/17066/warc/CC-MAIN-2024-10-17066-00166.warc.gz
crawl-data/CC-MAIN-2024-10/segments/17066/warc/CC-MAIN-2024-10-17066-00167.warc.gz
crawl-data/CC-MAIN-2024-10/segments/17066/warc/CC-MAIN-2024-10-17066-00168.warc.gz
crawl-data/CC-MAIN-2024-10/segments/17066/warc/CC-MAIN-2024-10-17066-00169.warc.gz
crawl-data/CC-MAIN-2024-10/segments/17066/warc/CC-MAIN-2024-10-17066-00170.warc.gz
crawl-data/CC-MAIN-2024-10/segments/17066/warc/CC-MAIN-2024-10-17066-00171.warc.gz
crawl-data/CC-MAIN-2024-10/segments/17066/warc/CC-MAIN-2024-10-17066-00172.warc.gz
crawl-data/CC-MAIN-2024-10/segments/17066/warc/CC-MAIN-2024-10-17066-00173.warc.gz
crawl-data/CC-MAIN-2024-10/segments/17066/warc/CC-MAIN-2024-10-17066-00174.warc.gz
crawl-data/CC-MAIN-2024-10/segments/17066/warc/CC-MAIN-2024-10-17066-00175.warc.gz
crawl-data/CC-MAIN-2024-10/segments/17066/warc/CC-MAIN-2024-10-17066-00176.warc.gz
crawl-data/CC-MAIN-2024-10/segments/17066/warc/CC-MAIN-2024-10-17066-00177.warc.gz
crawl-data/CC-MAIN-2024-10/segments/17066/warc/CC-MAIN-2024-10-17066-00178.warc.gz
crawl-data/CC-MAIN-2024-10/segments/17066/warc/CC-MAIN-2024-10-17066-00179.warc.gz
crawl-data/CC-MAIN-2024-10/segments/17066/warc/CC-MAIN-2024-10-17066-00180.warc.gz
crawl-data/CC-MAIN-2024-10/segments/17066/warc/CC-MAIN-2024-10-17066-00181.warc.gz
crawl-data/CC-MAIN-2024-10/segments/17066/warc/CC-MAIN-2024-10-17066-00182.warc.gz
crawl-data/CC-MAIN-2024-10/segments/17066/warc/CC-MAIN-2024-10-17066-00183.warc.gz
crawl-data/CC-MAIN-2024-10/segments/17066/warc/CC-MAIN-2024-10-17066-00184.warc.gz
crawl-data/CC-MAIN-2024-10/segments/17066/warc/CC-MAIN-2024-10-17066-00185.warc.gz
crawl-data/CC-MAIN-2024-10/segments/17066/warc/CC-MAIN-2024-10-17066-00186.warc.gz
crawl-data/CC-MAIN-2024-10/segments/17066/warc/CC-MAIN-2024-10-17066-00187.warc.gz
crawl-data/CC-MAIN-2024-10/segments/17066/warc/CC-MAIN-2024-10-17066-00188.warc.gz
crawl-data/CC-MAIN-2024-10/segments/17066/warc/CC-MAIN-2024-10-17066-00189.warc.gz
crawl-data/CC-MAIN-2024-10/segments/17066/warc/CC-MAIN-2024-10-17066-00190.warc.gz
crawl-data/CC-MAIN-2024-10/segments/17066/warc/CC-MAIN-2024-10-17066-00191.warc.gz
crawl-data/CC-MAIN-2024-10/segments/17066/warc/CC-MAIN-2024-10-17066-00192.warc.gz
crawl-data/CC-MAIN-2024-10/segments/17066/warc/CC-MAIN-2024-10-17066-00193.warc.gz
crawl-data/CC-MAIN-2024-10/segments/17066/warc/CC-MAIN-2024-10-17066-00194.warc.gz
crawl-data/CC-MAIN-2024-10/segments/17066/warc/CC-MAIN-2024-10-17066-00195.warc.gz
crawl-data/CC-MAIN-2024-10/segments/17066/warc/CC-MAIN-2024-10-17066-00196.warc.gz
crawl-data/CC-MAIN-2024-10/segments/17066/warc/CC-MAIN-2024-10-17066-00197.warc.gz
crawl-data/CC-MAIN-2024-10/segments/17066/warc/CC-MAIN-2024-10-17066-00198.warc.gz
crawl-data/CC-MAIN-2024-10/segments/17066/warc/CC-MAIN-2024-10-17066-00199.warc.gz
`;

// =================================================================================================
// --- ALEPH PROTOCOL: THE LETTERFORM INDEX (AS JSON STRING) ---
// Stored as a string to be parsed asynchronously, preventing main thread blockage.
// =================================================================================================

const letterformIndexJSON = JSON.stringify({
    'א': { letter: 'א', name: 'Aleph', spelling: 'אלף', gematria: 1, shape: 'open', revealedArchetype: 'The Unstruck Spark', constituentAnalysis: [ { letter: 'ל', functionalRole: 'Structural Guidance (Lamed)' }, { letter: 'פ', functionalRole: 'Voiced Expression (Peh)' } ], archetypalWords: { 'אור': 'Light', 'אמת': 'Truth', 'אהבה': 'Love', 'אחד': 'One' }, networkCentrality: 0.95, semanticField: ['Source', 'Unity', 'Breath', 'Beginning'] },
    'ב': { letter: 'ב', name: 'Bet', spelling: 'בית', gematria: 2, shape: 'closed', revealedArchetype: 'The Sacred Vessel', constituentAnalysis: [ { letter: 'י', functionalRole: 'Manifest Spirit (Yud)' }, { letter: 'ת', functionalRole: 'Sealed Covenant (Tav)' } ], archetypalWords: { 'בית': 'House', 'ברכה': 'Blessing', 'בן': 'Son' }, networkCentrality: 0.8, semanticField: ['Vessel', 'Dwelling', 'Creation', 'Duality'] },
    'ג': { letter: 'ג', name: 'Gimel', spelling: 'גימל', gematria: 3, shape: 'open', revealedArchetype: 'The Wayfarer', constituentAnalysis: [ { letter: 'י', functionalRole: 'Directed Spirit (Yud)' }, { letter: 'מ', functionalRole: 'Flowing Form (Mem)' }, { letter: 'ל', functionalRole: 'Structural Guidance (Lamed)' } ], archetypalWords: { 'גבורה': 'Strength', 'גדול': 'Great' }, networkCentrality: 0.6, semanticField: ['Movement', 'Benevolence', 'Camel'] },
    'ד': { letter: 'ד', name: 'Dalet', spelling: 'דלת', gematria: 4, shape: 'closed', revealedArchetype: 'The Keystone', constituentAnalysis: [ { letter: 'ל', functionalRole: 'Structural Guidance (Lamed)' }, { letter: 'ת', functionalRole: 'Sealed Covenant (Tav)' } ], archetypalWords: { 'דרך': 'Way/Path', 'דבר': 'Word/Thing', 'דם': 'Blood', 'דמי': 'Tears/Blood' }, networkCentrality: 0.7, semanticField: ['Doorway', 'Structure', 'Poverty', 'Matter'] },
    'ה': { letter: 'ה', name: 'He', spelling: 'הא', gematria: 5, shape: 'open', revealedArchetype: 'The Revealing Breath', constituentAnalysis: [ { letter: 'א', functionalRole: 'Primal Source (Aleph)' } ], archetypalWords: { 'הוד': 'Splendor', 'היה': 'To be' }, networkCentrality: 0.9, semanticField: ['Revelation', 'Expression', 'Breath'] },
    'ו': { letter: 'ו', name: 'Vav', spelling: 'ויו', gematria: 6, shape: 'vertical', revealedArchetype: 'The Golden Thread', constituentAnalysis: [ { letter: 'י', functionalRole: 'Directed Spirit (Yud)' } ], archetypalWords: { 'ו': 'And' }, networkCentrality: 0.92, semanticField: ['Connection', 'Link', 'Continuation', 'Nail'] },
    'ז': { letter: 'ז', name: 'Zayin', spelling: 'זין', gematria: 7, shape: 'vertical', revealedArchetype: 'The Sword of Time', constituentAnalysis: [ { letter: 'י', functionalRole: 'Directed Spirit (Yud)' }, { letter: 'ן', functionalRole: 'Vessel of Spirit (Nun Sofit)' } ], archetypalWords: { 'זהב': 'Gold' }, networkCentrality: 0.5, semanticField: ['Weapon', 'Time', 'Ornament'] },
    'ח': { letter: 'ח', name: 'Het', spelling: 'חית', gematria: 8, shape: 'closed', revealedArchetype: 'The Living Gate', constituentAnalysis: [ { letter: 'י', functionalRole: 'Manifest Spirit (Yud)' }, { letter: 'ת', functionalRole: 'Sealed Covenant (Tav)' } ], archetypalWords: { 'חיים': 'Life', 'חסד': 'Mercy/Grace', 'חכמה': 'Wisdom' }, networkCentrality: 0.75, semanticField: ['Life', 'Transcendence', 'Fence', 'Grace'] },
    'ט': { letter: 'ט', name: 'Tet', spelling: 'טית', gematria: 9, shape: 'closed', revealedArchetype: 'The Coiled Potential', constituentAnalysis: [ { letter: 'י', functionalRole: 'Manifest Spirit (Yud)' }, { letter: 'ת', functionalRole: 'Sealed Covenant (Tav)' } ], archetypalWords: { 'טוב': 'Good' }, networkCentrality: 0.45, semanticField: ['Goodness', 'Hidden', 'Serpent', 'Container'] },
    'י': { letter: 'י', name: 'Yud', spelling: 'יוד', gematria: 10, shape: 'open', revealedArchetype: 'The Seed of Spirit', constituentAnalysis: [ { letter: 'ו', functionalRole: 'Connecting Principle (Vav)' }, { letter: 'ד', functionalRole: 'Structured Form (Dalet)' } ], archetypalWords: { 'יהוה': 'YHVH', 'ישועה': 'Salvation', 'יום': 'Day' }, networkCentrality: 0.98, semanticField: ['Spirit', 'Point', 'Potential', 'Hand'] },
    'כ': { letter: 'כ', name: 'Kaf', spelling: 'כף', gematria: 20, shape: 'open', revealedArchetype: 'The Shaping Palm', constituentAnalysis: [ { letter: 'פ', functionalRole: 'Voiced Expression (Peh)' } ], archetypalWords: { 'כתר': 'Crown', 'כבוד': 'Glory' }, networkCentrality: 0.65, semanticField: ['Container', 'Palm', 'Force', 'Crown'] },
    'ל': { letter: 'ל', name: 'Lamed', spelling: 'למד', gematria: 30, shape: 'vertical', revealedArchetype: 'The Guiding Star', constituentAnalysis: [ { letter: 'מ', functionalRole: 'Flowing Form (Mem)' }, { letter: 'ד', functionalRole: 'Structured Form (Dalet)' } ], archetypalWords: { 'לב': 'Heart', 'לעד': 'Forever' }, networkCentrality: 0.85, semanticField: ['Guidance', 'Learning', 'Purpose', 'Staff'] },
    'מ': { letter: 'מ', name: 'Mem', spelling: 'מם', gematria: 40, shape: 'closed', revealedArchetype: 'The Primal Spring', constituentAnalysis: [ { letter: 'ם', functionalRole: 'Finality/Closure (Mem Sofit)' } ], archetypalWords: { 'מלך': 'King', 'מלכות': 'Kingdom', 'מים': 'Water', 'דמ': 'Silent/Stillness' }, networkCentrality: 0.88, semanticField: ['Water', 'Flow', 'Source', 'Womb'] },
    'נ': { letter: 'נ', name: 'Nun', spelling: 'נון', gematria: 50, shape: 'open', revealedArchetype: 'The Emergent Soul', constituentAnalysis: [ { letter: 'ו', functionalRole: 'Connecting Principle (Vav)' }, { letter: 'ן', functionalRole: 'Vessel of Spirit (Nun Sofit)' } ], archetypalWords: { 'נצח': 'Eternity', 'נפש': 'Soul' }, networkCentrality: 0.72, semanticField: ['Soul', 'Emergence', 'Faithfulness', 'Fish'] },
    'ס': { letter: 'ס', name: 'Samekh', spelling: 'סמך', gematria: 60, shape: 'closed', revealedArchetype: 'The Circle of Fate', constituentAnalysis: [ { letter: 'מ', functionalRole: 'Flowing Form (Mem)' }, { letter: 'ך', functionalRole: 'Contained Form (Kaf Sofit)' } ], archetypalWords: { 'סוד': 'Secret' }, networkCentrality: 0.55, semanticField: ['Support', 'Circle', 'Foundation', 'Secret'] },
    'ע': { letter: 'ע', name: 'Ayin', spelling: 'עין', gematria: 70, shape: 'open', revealedArchetype: 'The Eye of Providence', constituentAnalysis: [ { letter: 'י', functionalRole: 'Directed Spirit (Yud)' }, { letter: 'ן', functionalRole: 'Vessel of Spirit (Nun Sofit)' } ], archetypalWords: { 'עץ': 'Tree', 'עין': 'Eye' }, networkCentrality: 0.78, semanticField: ['Vision', 'Perception', 'Spring', 'Eye'] },
    'פ': { letter: 'פ', name: 'Pe', spelling: 'פא', gematria: 80, shape: 'open', revealedArchetype: 'The Spoken Word', constituentAnalysis: [ { letter: 'א', functionalRole: 'Primal Source (Aleph)' } ], archetypalWords: { 'פנים': 'Face' }, networkCentrality: 0.68, semanticField: ['Mouth', 'Speech', 'Opening', 'Expression'] },
    'צ': { letter: 'צ', name: 'Tsade', spelling: 'צדי', gematria: 90, shape: 'open', revealedArchetype: 'The Righteous Path', constituentAnalysis: [ { letter: 'ד', functionalRole: 'Structured Form (Dalet)' }, { letter: 'י', functionalRole: 'Manifest Spirit (Yud)' } ], archetypalWords: { 'צדק': 'Righteousness', 'ציון': 'Zion' }, networkCentrality: 0.62, semanticField: ['Righteousness', 'Justice', 'Hunt', 'Side'] },
    'ק': { letter: 'ק', name: 'Qof', spelling: 'קוף', gematria: 100, shape: 'open', revealedArchetype: 'The Sacred Cycle', constituentAnalysis: [ { letter: 'ו', functionalRole: 'Connecting Principle (Vav)' }, { letter: 'פ', functionalRole: 'Voiced Expression (Peh)' } ], archetypalWords: { 'קדושה': 'Holiness', 'קול': 'Voice' }, networkCentrality: 0.58, semanticField: ['Holiness', 'Cycle', 'Imitation', 'Voice'] },
    'ר': { letter: 'ר', name: 'Resh', spelling: 'ריש', gematria: 200, shape: 'open', revealedArchetype: 'The Sovereign Mind', constituentAnalysis: [ { letter: 'י', functionalRole: 'Directed Spirit (Yud)' }, { letter: 'ש', functionalRole: 'Transformative Fire (Shin)' } ], archetypalWords: { 'רוח': 'Spirit', 'רחמים': 'Compassion', 'ראש': 'Head' }, networkCentrality: 0.82, semanticField: ['Head', 'Beginning', 'Movement', 'Person'] },
    'ש': { letter: 'ש', name: 'Shin', spelling: 'שין', gematria: 300, shape: 'open', revealedArchetype: 'The Transforming Flame', constituentAnalysis: [ { letter: 'י', functionalRole: 'Directed Spirit (Yud)' }, { letter: 'ן', functionalRole: 'Vessel of Spirit (Nun Sofit)' } ], archetypalWords: { 'שלום': 'Peace', 'שכינה': 'Divine Presence', 'שם': 'Name' }, networkCentrality: 0.89, semanticField: ['Fire', 'Transformation', 'Spirit', 'Tooth'] },
    'ת': { letter: 'ת', name: 'Tav', spelling: 'תו', gematria: 400, shape: 'closed', revealedArchetype: 'The Final Seal', constituentAnalysis: [ { letter: 'ו', functionalRole: 'Connecting Principle (Vav)' } ], archetypalWords: { 'תורה': 'Torah/Law', 'תפארת': 'Glory/Beauty', 'תמיד': 'Always' }, networkCentrality: 0.79, semanticField: ['Covenant', 'Sign', 'Completion', 'Mark'] },
});

// =================================================================================================
// --- NETWORK CLASS ---
// =================================================================================================

export class HebrewAlphabetNetwork {
    private masterKey: Set<string> = new Set(['י', 'ר', 'ו', 'ש', 'ל', 'ם']);
    private isInitialized = false;
    private letterformIndex: Record<string, LetterformAnalysis> = {};
    private archetypalWordCache: Map<string, string> | null = null;

    public async initialize() {
        if (this.isInitialized) return;
        this.letterformIndex = JSON.parse(letterformIndexJSON);
        this.isInitialized = true;
    }

    public getMasterKey(): Set<string> {
        return this.masterKey;
    }

    public getLetterformAnalysis(letter: string): LetterformAnalysis | undefined {
        if (!this.isInitialized) {
            console.warn("HebrewAlphabetNetwork accessed before initialization.");
            return undefined;
        }
        const baseLetter = { 'ך': 'כ', 'ם': 'מ', 'ן': 'נ', 'ף': 'פ', 'ץ': 'צ' }[letter] || letter;
        return this.letterformIndex[baseLetter];
    }
    
    public getAllArchetypalWords(): Map<string, string> {
        if (this.archetypalWordCache) {
            return this.archetypalWordCache;
        }
        const cache = new Map<string, string>();
        for (const letter in this.letterformIndex) {
            const analysis = this.letterformIndex[letter];
            if (analysis.archetypalWords) {
                for (const word in analysis.archetypalWords) {
                    if (!cache.has(word)) {
                        cache.set(word, analysis.archetypalWords[word]);
                    }
                }
            }
        }
        this.archetypalWordCache = cache;
        return this.archetypalWordCache;
    }

    public getRandomArchetype(): LetterformAnalysis | undefined {
        if (!this.isInitialized) return undefined;
        const alphabet = Object.keys(this.letterformIndex);
        const randomLetter = alphabet[Math.floor(Math.random() * alphabet.length)];
        return this.letterformIndex[randomLetter];
    }

    private getLetterGematria(letter: string): number {
        const analysis = this.getLetterformAnalysis(letter);
        return analysis?.gematria || 0;
    }

    public calculatePathGematria(path: string[]): number {
        return path.reduce((sum, letter) => sum + this.getLetterGematria(letter), 0);
    }
}

export const hebrewNetwork = new HebrewAlphabetNetwork();