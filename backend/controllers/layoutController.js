import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import { ErrorHandler } from "../middlewares/errorHandler.js";
import layoutModel from "../models/layoutModel.js";

export const createLayout = catchAsyncErrors(async (req, res, next) => {
    try{
        const {type} = req.body || {};

        const isTypeExists = await layoutModel.findOne({type});
        if(isTypeExists){
            return next(new ErrorHandler(400, `${type} already exists`));
        }

        if(type === "Banner"){
            const {image, title, subTitle} = req.body || {};
            const myCloud = await cloudinary.v2.uploader.upload(image, {
                folder: "layout",
            });

            const bannerData = {
                tyype: "Banner",
                banner: {
                    image: {
                        public_id: myCloud.public_id,
                        url: myCloud.secure_url,
                    },
                    title,
                    subTitle,
                }
            };

            await layoutModel.create(bannerData);
        }

        if(type === "FAQ"){
            const {faqs} = req.body || {};
            const faqItems = await Promise.all(
                faqs.map(async (item) => {
                    return {
                        question: item.question,
                        answer: item.answer,
                    };
                })
            );

            await layoutModel.create({type:"FAQ",faqs: faqItems});
        }

        if(type === "Categories"){
            const {categories} = req.body || {};
               const catItems = await Promise.all(
                categories.map(async (item) => {
                    return {
                        title: item.title,
                    };
                })
            );  
            await layoutModel.create({type:"Categories", categories: catItems});
        }
        res.status(200).json({
            success: true,
            message: "Layout updated successfully",

        });
    }catch (err) {
        return next(new ErrorHandler(500, err.message));
    }
});

//Edit Layout
export const editLayout = catchAsyncErrors(async (req, res, next) => {
    try{
        const {type} = req.body || {};

        if(type === "Banner"){
            const bannerData = await layoutModel.findOne({type: "Banner"});
            const {image, title, subTitle} = req.body || {};

            const data= image.startsWith("https")
                ? bannerData
                : await cloudinary.v2.uploader.upload(image, {
                    folder: "layout",
                });

            const banner = {
                type: "Banner",
                image: {
                    public_id: image.startsWith("https")
                        ? bannerData.banner.image.public_id
                        : data?.public_id,
                    url: image.startsWith("https")
                        ? bannerData.banner.image.url
                        : data?.secure_url,
                },
                title,
                subTitle,
            };

            await layoutModel.findByIdAndUpdate(bannerData._id, {banner});
        }

        if(type === "FAQ"){
            const {faqs} = req.body || {};
            const FaqItems = await layoutModel.findOne({type: "FAQ"});
            
            const faqItems = await Promise.all(
                faqs.map(async (item) => {
                    return {
                        question: item.question,
                        answer: item.answer,
                    };
                })
            );
            await layoutModel.findByIdAndUpdate(FaqItems?._id, {
                type:"FAQ",
                faqs: faqItems
            });
        }

        if(type === "Categories"){
            const {categories} = req.body || {};
            const categoriesData = await layoutModel.findOne({type: "Categories"});
            const catItems = await Promise.all(
                categories.map(async (item) => {
                    return {
                        title: item.title,
                    };
                })
            );
            await layoutModel.findByIdAndUpdate(categoriesData?._id, {
                type:"Categories", 
                categories: catItems
            });
        }
        res.status(200).json({
            success: true,
            message: "Layout updated successfully",

        });

    }catch (err) {
        return next(new ErrorHandler(500, err.message));
    }
});

//get Layout by type
export const getLayoutByType = catchAsyncErrors(async (req, res, next) => {
    try{
        const {type} = req.params || {};
        const layout = await layoutModel.findOne({type});

        res.status(201).json({
            success: true,
            layout,
        }); 

    }catch (err) {
        return next(new ErrorHandler(500, err.message));
    }
});