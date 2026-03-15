// import Result from "../models/resultModel.js";

// //CREATE RESULT
// export async function createResult(req, res) {
//     try {
//         //Check if user is authenticated
//         if (!req.user || !req.user.id) {
//             return res.status(401).json({
//                 success: false,
//                 message: "Unauthorized: User not authenticated"
//             });
//         }

//         //Extract fields from request body
//         const { title, technology, level, totalQuestions, correct, wrong } = req.body;

//         //Validate required fields
//         if (!technology || !level || totalQuestions === undefined || correct === undefined || wrong === undefined) {
//             return res.status(400).json({
//                 success: false,
//                 message: "Missing required fields"
//             });
//         }

//         //compute wrong if not provided
//         const computedWrong = wrong !== undefined ? Number(wrong) : Math.max(0, Number(totalQuestions) - Number(correct));

//         //Validate title if provided
//         if (!title){
//             return res.status(400).json({
//                 success: false,
//                 message: "Missing title field"
//             });
//         }

//         //Create result payload
//         const payload = {
//             title: String(title).trim(),
//             technology,
//             level,
//             totalQuestions: Number(totalQuestions),
//             correct: Number(correct),
//             wrong: computedWrong,
//             user: req.user.id //for a particular user
//         };

//         //Create and save the result
//         const created = await Result.create(payload);
//         return res.status(201).json({
//             success: true,
//             message: "Result created successfully",
//             result: created
//         });
      
//     } catch (err) {
//         console.error("Create Result Error:", err);
//         return res.status(500).json({
//             success: false,
//             message: "Error creating result",
//         });
//     }
// }

// //LIST RESULTS FOR A USER
// export async function listResults(req, res) {
//     try {
//         //Check if user is authenticated
//         if (!req.user || !req.user.id) {
//             return res.status(401).json({
//                 success: false,
//                 message: "Unauthorized: User not authenticated"
//             });
//         }

//         //Extract technology filter from query parameters
//         const {technology} = req.query;
//         //Build query to fetch results for the authenticated user
//         const query = { user: req.user.id };
         
//         //If technology filter is provided and not 'all', add it to the query
//         if (technology && technology.toLowerCase() !== 'all') {
//             query.technology = technology;
//         }

//         //Fetch results for the authenticated user, optionally filtered by technology
//         const items = (await Result.find(query)).sort({ createdAt: -1 }).lean();
//         return res.status(200).json({
//             success: true,
//             results: items
//         });

//     } 
//     catch (err) {
//         console.error("List Results Error:", err);
//         return res.status(500).json({
//             success: false,
//             message: "Error listing results",
//         });
//     }
// }