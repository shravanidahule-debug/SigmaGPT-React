import express from "express";
import Thread from "../models/Thread.js";
import getgeminiAPIResponse from "../utlis/gemini.js";

const router = express.Router();


// router.get("/ping", (req, res) => {
//   res.send("pong");
// });


//test
router.post("/test", async (req, res) => {
    try {
        const thread = new Thread({
            threadId: "xyz",
            title: "Testing new Thread"
        });

        const response = await thread.save();
        console.log("Saved thread:", response);
       return res.send(response);
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: "Failed to save in DB" });
    }
});

//this is to show history of chats on basis of updated at
router.get("/thread", async (req, res) => {
    try {
        const threads = await Thread.find({}).sort({ updatedAt: -1 });
        //descendind order of updatedAt
        res.json(threads);
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: "Failed to fetch threads" });
    }
});

// To find particular thread message
router.get("/thread/:threadId", async(req,res)=>{

    const {threadId} = req.params;
    try{
      const thread = await Thread.findOne({threadId});

      if(!thread){
        return res.status(404).json({error :"Thread not found"});
      }
      return res.json(thread.messages);
    }catch(err){
        console.log(err);
        return res.status(500).json({ error: "Failed to fetch chat" });
    }
});

//deleted thread
router.delete("/thread/:threadId", async (req, res) => {
    const { threadId } = req.params;
    try {
        const deleteThread = await Thread.findOneAndDelete({ threadId });

        if (!deleteThread) {
            return res.status(404).json({ error: "thread not found" });
        } else {
           return res.status(200).json({ success: "thread is deleted successfully" });
        }
    } catch (err) {
        console.log(err);
       return  res.status(500).json({ error: "failed to found thread" })
    }
});

router.post("/chat", async (req, res) => {
    const { threadId, message } = req.body;

    if (!threadId || !message) {
       return res.status(400).json({ error: "missing required field" });
    }

    try {
        let thread = await Thread.findOne({ threadId });

        if (!thread) {
            // create a new thread in db

            thread = new Thread({
                threadId,
                title: message,
                message: [{ role: "user", content: message }],
            });
        } else {
            thread.messages.push({ role: "user", content: message });
        }

        const assistantReply = await getgeminiAPIResponse(message);
        thread.messages.push({ role: "assistant", content: assistantReply });
        thread.updatedAt = new Date();
        await thread.save();
        return res.json({ reply: assistantReply });
        
    }catch (err) {
    console.log(err);
}
});

export default router;