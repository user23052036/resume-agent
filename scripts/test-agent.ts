// Simple test script to demonstrate the minimal ResumeAgent functionality

import { createResumeAgent, ResumeData } from "../agents";

async function testAgent() {
  console.log("Testing Minimal ResumeAgent...\n");

  // Create agent instance
  const agent = createResumeAgent({
    backendUrl: process.env.BACKEND_URL || "http://localhost:3000"
  });

  // Sample resume text for testing
  const sampleResume: ResumeData = {
    text: `John Doe
Senior Software Engineer

Experience:
- 5 years as Full Stack Developer at Tech Corp
- Built React applications with Node.js backend
- Experience with AWS, Docker, and CI/CD pipelines
- Led team of 3 developers on microservices project

Skills:
- Languages: JavaScript, TypeScript, Python
- Frameworks: React, Node.js, Express
- Databases: MongoDB, PostgreSQL
- Tools: Docker, AWS, Git, Jenkins

Education:
- BS Computer Science, University of Technology (2018)

Projects:
- E-commerce platform serving 10K+ users
- Real-time chat application with WebSocket
- RESTful API for mobile app backend`,
    source: 'text',
    metadata: {
      extracted_at: new Date().toISOString()
    }
  };

  try {
    console.log("Processing resume...");
    const result = await agent.processResume(sampleResume);

    console.log(`✅ Successfully processed resume!`);
    console.log(`📊 Generated ${result.summaries.length} role summaries\n`);

    // Display summaries
    result.summaries.forEach((summary, index) => {
      console.log(`${index + 1}. ${summary.role.toUpperCase()}:`);
      console.log(`   ${summary.summary.substring(0, 100)}...`);
      console.log(`   Generated: ${new Date(summary.generated_at).toLocaleString()}\n`);
    });

    // Save results
    console.log("💾 Saving results to data folder...");
    await (agent as any).saveResults(result);
    console.log("✅ Results saved successfully!\n");

    console.log("🎉 Agent test completed successfully!");

  } catch (error) {
    console.error("❌ Agent test failed:", error);
    process.exit(1);
  }
}

// Run test if this script is executed directly
if (require.main === module) {
  testAgent().catch(console.error);
}

export { testAgent };
