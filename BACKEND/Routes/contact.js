const express=require("express")
const router=express.Router()
const Contact=require("../Models/contact")


router.get('/', async (req,res)=>{
    try{
        const messages=await Contact.find().sort({createdAt: -1})
        res.status(200).json(messages);
    }catch(err){
        res.status(500).json({msg: 'Failed to fetch messages', error: err.message})
    }
})

router.post('/', async(req,res)=>{
    try{
        const contact=new Contact(req.body)
        await contact.save();
        res.status(201).json({message:'Message saved successfully'})
    }
    catch(err){
        res.status(500).json({message:'server error',error:err.message})

    }
})

router.delete("/:id", async (req, res) => {
  try {
    await Contact.findByIdAndDelete(req.params.id);
    res.json({ msg: "contact deleted" });
  } catch (err) {
    res.status(500).json({ msg: "Error deleting", error: err.message });
  }
});


module.exports=router



