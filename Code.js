// CLARITY ASSESSMENT AUTO-SCORING
// Copy this entire script into your Response Sheet's Apps Script editor
// Then run: setupScoringColumns, then createTrigger

function setupScoringColumns() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getActiveSheet();
  var lastCol = sheet.getLastColumn();
  
  var scoreHeaders = [
    "Vignette_Correct",
    "Overall_Score", "Overall_Level",
    "Insight_Score", "Insight_Level",
    "Clarity_Score", "Clarity_Level", 
    "Learning_Score", "Learning_Level",
    "Boundaries_Score", "Boundaries_Level",
    "Reactivity_Score", "Reactivity_Level",
    "Overthinking_Score", "Overthinking_Level",
    "Impulsivity_Score", "Impulsivity_Level",
    "Avoidance_Score", "Avoidance_Level",
    "Radar_Score", "Radar_Level",
    "Interpretation_Score", "Interpretation_Level",
    "IntentImpact_Score", "IntentImpact_Level"
  ];
  
  for (var i = 0; i < scoreHeaders.length; i++) {
    var cell = sheet.getRange(1, lastCol + 1 + i);
    cell.setValue(scoreHeaders[i]);
    cell.setFontWeight("bold");
    cell.setBackground("#4472C4");
    cell.setFontColor("#FFFFFF");
  }
  
  sheet.setColumnWidth(lastCol + 1, 120);
  for (var i = 1; i < scoreHeaders.length; i++) {
    sheet.setColumnWidth(lastCol + 1 + i, 100);
  }
  
  SpreadsheetApp.getUi().alert("Scoring columns added! Now run 'createTrigger' to enable auto-scoring.");
}

function calculateScores() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getActiveSheet();
  var lastRow = sheet.getLastRow();
  
  if (lastRow < 2) {
    return;
  }
  
  var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  var scoreStartCol = headers.indexOf("Vignette_Correct") + 1;
  
  if (scoreStartCol === 0) {
    SpreadsheetApp.getUi().alert("Run 'setupScoringColumns' first!");
    return;
  }
  
  for (var row = 2; row <= lastRow; row++) {
    var r = row;
    
    // Check if already scored (skip if Overall_Score has value)
    var existingScore = sheet.getRange(r, scoreStartCol + 1).getValue();
    if (existingScore !== "" && existingScore !== null) {
      continue;
    }
    
    // Get context to determine which vignette to check
    var context = sheet.getRange(r, 4).getValue(); // Column D
    var careerVignette = sheet.getRange(r, 5).getValue(); // Column E
    var relVignette = sheet.getRange(r, 6).getValue(); // Column F
    
    // Vignette scoring
    var vignetteCorrect = 0;
    if (context.toLowerCase().indexOf("career") >= 0) {
      if (careerVignette && careerVignette.toLowerCase().indexOf("shift") >= 0) {
        vignetteCorrect = 1;
      }
    } else {
      if (relVignette && relVignette.toLowerCase().indexOf("inconsistent") >= 0) {
        vignetteCorrect = 1;
      }
    }
    sheet.getRange(r, scoreStartCol).setValue(vignetteCorrect);
    
    // Get all Likert answers
    var q2 = sheet.getRange(r, 7).getValue();  // G
    var q3 = sheet.getRange(r, 8).getValue();  // H
    var q4 = sheet.getRange(r, 9).getValue();  // I
    var q5 = sheet.getRange(r, 10).getValue(); // J
    var q6 = sheet.getRange(r, 11).getValue(); // K
    var q7 = sheet.getRange(r, 12).getValue(); // L
    var q8 = sheet.getRange(r, 13).getValue(); // M
    var q9 = sheet.getRange(r, 14).getValue(); // N
    var q10 = sheet.getRange(r, 15).getValue(); // O
    var q11 = sheet.getRange(r, 16).getValue(); // P - Reverse
    var q12 = sheet.getRange(r, 17).getValue(); // Q
    var q13 = sheet.getRange(r, 18).getValue(); // R
    var q14 = sheet.getRange(r, 19).getValue(); // S - Reverse
    var q15 = sheet.getRange(r, 20).getValue(); // T
    var q16 = sheet.getRange(r, 21).getValue(); // U - Reverse
    var q17 = sheet.getRange(r, 22).getValue(); // V
    var q18 = sheet.getRange(r, 23).getValue(); // W
    var q19 = sheet.getRange(r, 24).getValue(); // X - Reverse
    var q20 = sheet.getRange(r, 25).getValue(); // Y
    var q21 = sheet.getRange(r, 26).getValue(); // Z
    var q22 = sheet.getRange(r, 27).getValue(); // AA
    var q23 = sheet.getRange(r, 28).getValue(); // AB - Reverse
    var q24 = sheet.getRange(r, 29).getValue(); // AC
    var q25 = sheet.getRange(r, 30).getValue(); // AD
    var q26 = sheet.getRange(r, 31).getValue(); // AE
    var q27 = sheet.getRange(r, 32).getValue(); // AF
    var q28 = sheet.getRange(r, 33).getValue(); // AG
    var q29 = sheet.getRange(r, 34).getValue(); // AH - Reverse
    var q30 = sheet.getRange(r, 35).getValue(); // AI
    var q31 = sheet.getRange(r, 36).getValue(); // AJ - Reverse
    var q32 = sheet.getRange(r, 37).getValue(); // AK
    var q33 = sheet.getRange(r, 38).getValue(); // AL
    
    // Calculate raw averages
    var insightRaw = (q2 + q3 + q4 + q5 + q6 + q7) / 6;
    var clarityRaw = (q8 + q9 + q10 + (6 - q11)) / 4;
    var learningRaw = (q12 + q13 + (6 - q14) + q15 + (6 - q16)) / 5;
    var boundariesRaw = (q17 + q18 + (6 - q19) + q20) / 4;
    var reactivityRaw = (q21 + q22 + (6 - q23)) / 3;
    var overthinkingRaw = q24;
    var impulsivityRaw = q25;
    var avoidanceRaw = q26;
    var radarRaw = (q27 + q28 + (6 - q29)) / 3;
    var interpretationRaw = (q30 + (6 - q31) + q32) / 3;
    var intentImpactRaw = q33;
    
    // Scale to 0-100
    function scale(raw) {
      return Math.round((raw - 1) / 4 * 100 * 10) / 10;
    }
    
    var insightScore = scale(insightRaw);
    var clarityScore = scale(clarityRaw);
    var learningScore = scale(learningRaw);
    var boundariesScore = scale(boundariesRaw);
    var reactivityScore = scale(reactivityRaw);
    var overthinkingScore = scale(overthinkingRaw);
    var impulsivityScore = scale(impulsivityRaw);
    var avoidanceScore = scale(avoidanceRaw);
    var radarItemsScore = scale(radarRaw);
    var radarScore = Math.round((0.8 * radarItemsScore + 0.2 * (vignetteCorrect * 100)) * 10) / 10;
    var interpretationScore = scale(interpretationRaw);
    var intentImpactScore = scale(intentImpactRaw);
    
    var overallScore = Math.round((insightScore + clarityScore + learningScore) / 3 * 10) / 10;
    
    // Determine levels
    function getLevel(score) {
      if (score <= 33) return "Low";
      if (score <= 66) return "Medium";
      return "High";
    }
    
    // Write all scores and levels
    var col = scoreStartCol;
    
    // Overall
    sheet.getRange(r, col + 1).setValue(overallScore);
    sheet.getRange(r, col + 2).setValue(getLevel(overallScore));
    
    // Insight
    sheet.getRange(r, col + 3).setValue(insightScore);
    sheet.getRange(r, col + 4).setValue(getLevel(insightScore));
    
    // Clarity
    sheet.getRange(r, col + 5).setValue(clarityScore);
    sheet.getRange(r, col + 6).setValue(getLevel(clarityScore));
    
    // Learning
    sheet.getRange(r, col + 7).setValue(learningScore);
    sheet.getRange(r, col + 8).setValue(getLevel(learningScore));
    
    // Boundaries
    sheet.getRange(r, col + 9).setValue(boundariesScore);
    sheet.getRange(r, col + 10).setValue(getLevel(boundariesScore));
    
    // Reactivity
    sheet.getRange(r, col + 11).setValue(reactivityScore);
    sheet.getRange(r, col + 12).setValue(getLevel(reactivityScore));
    
    // Overthinking
    sheet.getRange(r, col + 13).setValue(overthinkingScore);
    sheet.getRange(r, col + 14).setValue(getLevel(overthinkingScore));
    
    // Impulsivity
    sheet.getRange(r, col + 15).setValue(impulsivityScore);
    sheet.getRange(r, col + 16).setValue(getLevel(impulsivityScore));
    
    // Avoidance
    sheet.getRange(r, col + 17).setValue(avoidanceScore);
    sheet.getRange(r, col + 18).setValue(getLevel(avoidanceScore));
    
    // Radar
    sheet.getRange(r, col + 19).setValue(radarScore);
    sheet.getRange(r, col + 20).setValue(getLevel(radarScore));
    
    // Interpretation
    sheet.getRange(r, col + 21).setValue(interpretationScore);
    sheet.getRange(r, col + 22).setValue(getLevel(interpretationScore));
    
    // Intent vs Impact
    sheet.getRange(r, col + 23).setValue(intentImpactScore);
    sheet.getRange(r, col + 24).setValue(getLevel(intentImpactScore));
    
    // Color code levels
    for (var i = 0; i < 12; i++) {
      var levelCell = sheet.getRange(r, col + 2 + (i * 2));
      var level = levelCell.getValue();
      if (level === "Low") {
        levelCell.setBackground("#FFC7CE");
      } else if (level === "Medium") {
        levelCell.setBackground("#FFEB9C");
      } else if (level === "High") {
        levelCell.setBackground("#C6EFCE");
      }
    }
  }
}

function createTrigger() {
  // Remove existing triggers first
  var triggers = ScriptApp.getProjectTriggers();
  for (var i = 0; i < triggers.length; i++) {
    ScriptApp.deleteTrigger(triggers[i]);
  }
  
  // Create new trigger
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  ScriptApp.newTrigger('calculateScores')
    .forSpreadsheet(ss)
    .onFormSubmit()
    .create();
  
  SpreadsheetApp.getUi().alert("Auto-scoring enabled! New responses will be scored automatically.");
}

// Run this manually if you have existing responses that need scoring
function scoreExistingResponses() {
  calculateScores();
  SpreadsheetApp.getUi().alert("All existing responses have been scored!");
}// ADD THIS TO YOUR EXISTING APPS SCRIPT (below the scoring functions)

function generateResultsEmail() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getActiveSheet();
  var ui = SpreadsheetApp.getUi();
  
  // Ask which row to generate for
  var response = ui.prompt('Generate Results Email', 'Enter row number (e.g., 2 for first response):', ui.ButtonSet.OK_CANCEL);
  
  if (response.getSelectedButton() !== ui.Button.OK) return;
  
  var row = parseInt(response.getResponseText());
  if (isNaN(row) || row < 2) {
    ui.alert('Invalid row number');
    return;
  }
  
  // Get name and email
  var name = sheet.getRange("B" + row).getValue();
  var email = sheet.getRange("AP" + row).getValue();
  
  // Get all levels
  var overallLvl = sheet.getRange("AS" + row).getValue();
  var insightLvl = sheet.getRange("AU" + row).getValue();
  var clarityLvl = sheet.getRange("AW" + row).getValue();
  var learningLvl = sheet.getRange("AY" + row).getValue();
  var boundariesLvl = sheet.getRange("BA" + row).getValue();
  var reactivityLvl = sheet.getRange("BC" + row).getValue();
  var overthinkLvl = sheet.getRange("BE" + row).getValue();
  var impulsivityLvl = sheet.getRange("BG" + row).getValue();
  var avoidanceLvl = sheet.getRange("BI" + row).getValue();
  var radarLvl = sheet.getRange("BK" + row).getValue();
  var interpLvl = sheet.getRange("BM" + row).getValue();
  var intentLvl = sheet.getRange("BO" + row).getValue();
  
  // Interpretation lookup
  var interp = {
    overall: {
      "Low": "You're still building a clear map of yourself. In high-stakes moments, it can be hard to tell what you want, what's true, and what's just noise.",
      "Medium": "You have a decent read on yourself, but clarity can blur under pressure. With a few upgrades, your decisions will feel cleaner and less draining.",
      "High": "You generally know what drives you. Your self-map is stable enough to guide choices, and you tend to learn and adjust over time."
    },
    insight: {
      "Low": "You may struggle to explain why you react the way you do. Triggers and patterns aren't always visible to you yet.",
      "Medium": "You sometimes understand your reactions, but under pressure it gets foggy.",
      "High": "You can usually name what's driving your reactions — fear, values, uncertainty — and that helps you respond better."
    },
    clarity: {
      "Low": "Your sense of self shifts depending on context or who you're with. Values and strengths may feel unclear.",
      "Medium": "You have a reasonable sense of who you are, but it can wobble under stress or social pressure.",
      "High": "Your values, strengths, and sense of identity are stable enough to guide decisions consistently."
    },
    learning: {
      "Low": "You may repeat patterns even after recognizing them. Reflecting on mistakes can feel difficult or painful.",
      "Medium": "You learn from some experiences but not others. Patterns sometimes repeat.",
      "High": "You reflect after key moments and adjust. You can learn from mistakes without excessive self-criticism."
    },
    boundaries: {
      "Low": "You protect your needs and can say no. You may want to check that warmth and flexibility are still present.",
      "Medium": "Boundaries slip under pressure. You sometimes over-give or delay hard conversations.",
      "High": "You tend to say yes when you mean no, feel responsible for others' comfort, and avoid difficult conversations until things build up."
    },
    reactivity: {
      "Low": "You stay steady under uncertainty. Emotions don't hijack your thinking. Watch for under-feeling or emotional avoidance.",
      "Medium": "You feel things but can usually manage. Under high stress, emotions may take over temporarily.",
      "High": "Uncertainty spikes your emotions quickly. It's hard to think clearly when activated, and returning to baseline takes time."
    },
    overthink: {
      "Low": "You act without excessive analysis. Make sure you're not skipping important reflection.",
      "Medium": "You balance thinking and doing, though you can get stuck sometimes.",
      "High": "You research and ruminate instead of taking small steps. Analysis becomes a way to avoid action."
    },
    impulsivity: {
      "Low": "You rarely act without thinking. Decisions are considered.",
      "Medium": "Sometimes you act fast and regret it, but not consistently.",
      "High": "You often act quickly and regret it later. Slowing down before decisions would help."
    },
    avoidance: {
      "Low": "You face decisions rather than postponing them.",
      "Medium": "You sometimes delay hoping things resolve themselves.",
      "High": "You tend to delay decisions, hoping the situation will sort itself out. It usually doesn't."
    },
    radar: {
      "Low": "You may miss subtle shifts in tone, energy, or group dynamics — especially under pressure.",
      "Medium": "You catch some signals but miss others, particularly when stressed or distracted.",
      "High": "You notice when something feels 'off' in interactions, even if it's subtle. You pick up on shifts in tone and energy."
    },
    interp: {
      "Low": "You tend to lock onto one explanation quickly — often 'it's about me' — without considering alternatives.",
      "Medium": "You sometimes jump to conclusions but can course-correct when prompted.",
      "High": "You hold multiple possible explanations and prefer to ask clarifying questions rather than assume."
    },
    intent: {
      "Low": "You may be unaware when your words or actions land differently than intended. Blind spots here can strain relationships.",
      "Medium": "You sometimes notice gaps between what you meant and how it landed.",
      "High": "You're generally aware that intent and impact don't always match, which helps you communicate and repair better."
    }
  };
  
  // Build email
  var emailBody = "Hi " + name + ",\n\n";
  emailBody += "Thanks for taking the Clarity Assessment. Here's what your responses reveal about how you make decisions and navigate relationships and work.\n\n";
  emailBody += "This is a reflection tool, not a diagnosis. The goal is awareness — not a label.\n\n";
  emailBody += "---\n\n";
  
  emailBody += "OVERALL SELF-AWARENESS: " + overallLvl + "\n";
  emailBody += interp.overall[overallLvl] + "\n\n";
  
  emailBody += "---\n\n";
  emailBody += "YOUR PILLARS\n\n";
  
  emailBody += "Insight: " + insightLvl + "\n";
  emailBody += interp.insight[insightLvl] + "\n\n";
  
  emailBody += "Clarity: " + clarityLvl + "\n";
  emailBody += interp.clarity[clarityLvl] + "\n\n";
  
  emailBody += "Learning: " + learningLvl + "\n";
  emailBody += interp.learning[learningLvl] + "\n\n";
  
  emailBody += "---\n\n";
  emailBody += "YOUR DECISION HABITS\n\n";
  
  emailBody += "Boundaries: " + boundariesLvl + "\n";
  emailBody += interp.boundaries[boundariesLvl] + "\n\n";
  
  emailBody += "Reactivity: " + reactivityLvl + "\n";
  emailBody += interp.reactivity[reactivityLvl] + "\n\n";
  
  emailBody += "Thinking Style:\n";
  emailBody += "• Overthinking: " + overthinkLvl + " — " + interp.overthink[overthinkLvl] + "\n";
  emailBody += "• Impulsivity: " + impulsivityLvl + " — " + interp.impulsivity[impulsivityLvl] + "\n";
  emailBody += "• Avoidance: " + avoidanceLvl + " — " + interp.avoidance[avoidanceLvl] + "\n\n";
  
  emailBody += "Social Radar: " + radarLvl + "\n";
  emailBody += interp.radar[radarLvl] + "\n\n";
  
  emailBody += "Social Interpretation: " + interpLvl + "\n";
  emailBody += interp.interp[interpLvl] + "\n\n";
  
  emailBody += "Intent vs Impact: " + intentLvl + "\n";
  emailBody += interp.intent[intentLvl] + "\n\n";
  
  emailBody += "---\n\n";
  emailBody += "WHAT'S NEXT?\n\n";
  emailBody += "This assessment shows you what's happening — your patterns and tendencies.\n";
  emailBody += "The next step is learning what to do about it. We're building guided tools for that. If you want early access, let me know.\n\n";
  
  emailBody += "---\n\n";
  emailBody += "QUICK QUESTIONS FOR YOU:\n\n";
  emailBody += "1. How accurate did this feel? (1-5)\n";
  emailBody += "2. What surprised you or felt off?\n";
  emailBody += "3. Would you want help working on any of these patterns?\n\n";
  emailBody += "Just reply to this email — I'd love your honest feedback.\n\n";
  emailBody += "Thanks,\n[Your name]";
  
  // Create new sheet with the email content
  var outputSheet = ss.getSheetByName("Generated Emails");
  if (!outputSheet) {
    outputSheet = ss.insertSheet("Generated Emails");
    outputSheet.getRange("A1").setValue("Row");
    outputSheet.getRange("B1").setValue("Name");
    outputSheet.getRange("C1").setValue("Email");
    outputSheet.getRange("D1").setValue("Subject");
    outputSheet.getRange("E1").setValue("Body");
    outputSheet.setColumnWidth(5, 800);
  }
  
  var outputRow = outputSheet.getLastRow() + 1;
  outputSheet.getRange("A" + outputRow).setValue(row);
  outputSheet.getRange("B" + outputRow).setValue(name);
  outputSheet.getRange("C" + outputRow).setValue(email);
  outputSheet.getRange("D" + outputRow).setValue("Your Clarity Assessment Results");
  outputSheet.getRange("E" + outputRow).setValue(emailBody);
  
  ui.alert("Email generated! Go to 'Generated Emails' sheet, copy from column E, and send to: " + email);
}
function generateAllEmails() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("Form responses 1"); // Change this to your actual response sheet name if different
  var lastRow = sheet.getLastRow();
  
  for (var row = 2; row <= lastRow; row++) {
    generateEmailForRowFixed(row, sheet, ss);
  }
  
  Logger.log("All emails generated for rows 2 to " + lastRow);
}

function generateEmailForRowFixed(row, sheet, ss) {
  var name = sheet.getRange("B" + row).getValue();
  var email = sheet.getRange("AP" + row).getValue();
  
  if (!name) return;
  
  var overallLvl = sheet.getRange("AS" + row).getValue();
  var insightLvl = sheet.getRange("AU" + row).getValue();
  var clarityLvl = sheet.getRange("AW" + row).getValue();
  var learningLvl = sheet.getRange("AY" + row).getValue();
  var boundariesLvl = sheet.getRange("BA" + row).getValue();
  var reactivityLvl = sheet.getRange("BC" + row).getValue();
  var overthinkLvl = sheet.getRange("BE" + row).getValue();
  var impulsivityLvl = sheet.getRange("BG" + row).getValue();
  var avoidanceLvl = sheet.getRange("BI" + row).getValue();
  var radarLvl = sheet.getRange("BK" + row).getValue();
  var interpLvl = sheet.getRange("BM" + row).getValue();
  var intentLvl = sheet.getRange("BO" + row).getValue();
  
  var interp = {
    overall: {
      "Low": "You're still building a clear map of yourself. In high-stakes moments, it can be hard to tell what you want, what's true, and what's just noise.",
      "Medium": "You have a decent read on yourself, but clarity can blur under pressure. With a few upgrades, your decisions will feel cleaner and less draining.",
      "High": "You generally know what drives you. Your self-map is stable enough to guide choices, and you tend to learn and adjust over time."
    },
    insight: {
      "Low": "You may struggle to explain why you react the way you do. Triggers and patterns aren't always visible to you yet.",
      "Medium": "You sometimes understand your reactions, but under pressure it gets foggy.",
      "High": "You can usually name what's driving your reactions — fear, values, uncertainty — and that helps you respond better."
    },
    clarity: {
      "Low": "Your sense of self shifts depending on context or who you're with. Values and strengths may feel unclear.",
      "Medium": "You have a reasonable sense of who you are, but it can wobble under stress or social pressure.",
      "High": "Your values, strengths, and sense of identity are stable enough to guide decisions consistently."
    },
    learning: {
      "Low": "You may repeat patterns even after recognizing them. Reflecting on mistakes can feel difficult or painful.",
      "Medium": "You learn from some experiences but not others. Patterns sometimes repeat.",
      "High": "You reflect after key moments and adjust. You can learn from mistakes without excessive self-criticism."
    },
    boundaries: {
      "Low": "You protect your needs and can say no. You may want to check that warmth and flexibility are still present.",
      "Medium": "Boundaries slip under pressure. You sometimes over-give or delay hard conversations.",
      "High": "You tend to say yes when you mean no, feel responsible for others' comfort, and avoid difficult conversations until things build up."
    },
    reactivity: {
      "Low": "You stay steady under uncertainty. Emotions don't hijack your thinking. Watch for under-feeling or emotional avoidance.",
      "Medium": "You feel things but can usually manage. Under high stress, emotions may take over temporarily.",
      "High": "Uncertainty spikes your emotions quickly. It's hard to think clearly when activated, and returning to baseline takes time."
    },
    overthink: {
      "Low": "You act without excessive analysis. Make sure you're not skipping important reflection.",
      "Medium": "You balance thinking and doing, though you can get stuck sometimes.",
      "High": "You research and ruminate instead of taking small steps. Analysis becomes a way to avoid action."
    },
    impulsivity: {
      "Low": "You rarely act without thinking. Decisions are considered.",
      "Medium": "Sometimes you act fast and regret it, but not consistently.",
      "High": "You often act quickly and regret it later. Slowing down before decisions would help."
    },
    avoidance: {
      "Low": "You face decisions rather than postponing them.",
      "Medium": "You sometimes delay hoping things resolve themselves.",
      "High": "You tend to delay decisions, hoping the situation will sort itself out. It usually doesn't."
    },
    radar: {
      "Low": "You may miss subtle shifts in tone, energy, or group dynamics — especially under pressure.",
      "Medium": "You catch some signals but miss others, particularly when stressed or distracted.",
      "High": "You notice when something feels 'off' in interactions, even if it's subtle. You pick up on shifts in tone and energy."
    },
    interp: {
      "Low": "You tend to lock onto one explanation quickly — often 'it's about me' — without considering alternatives.",
      "Medium": "You sometimes jump to conclusions but can course-correct when prompted.",
      "High": "You hold multiple possible explanations and prefer to ask clarifying questions rather than assume."
    },
    intent: {
      "Low": "You may be unaware when your words or actions land differently than intended. Blind spots here can strain relationships.",
      "Medium": "You sometimes notice gaps between what you meant and how it landed.",
      "High": "You're generally aware that intent and impact don't always match, which helps you communicate and repair better."
    }
  };
  
  var emailBody = "Hi " + name + ",\n\n";
  emailBody += "Thanks for taking the Clarity Assessment. Here's what your responses reveal about how you make decisions and navigate relationships and work.\n\n";
  emailBody += "This is a reflection tool, not a diagnosis. The goal is awareness — not a label.\n\n";
  emailBody += "---\n\n";
  
  emailBody += "OVERALL SELF-AWARENESS: " + overallLvl + "\n";
  emailBody += interp.overall[overallLvl] + "\n\n";
  
  emailBody += "---\n\n";
  emailBody += "YOUR PILLARS\n\n";
  
  emailBody += "Insight: " + insightLvl + "\n";
  emailBody += interp.insight[insightLvl] + "\n\n";
  
  emailBody += "Clarity: " + clarityLvl + "\n";
  emailBody += interp.clarity[clarityLvl] + "\n\n";
  
  emailBody += "Learning: " + learningLvl + "\n";
  emailBody += interp.learning[learningLvl] + "\n\n";
  
  emailBody += "---\n\n";
  emailBody += "YOUR DECISION HABITS\n\n";
  
  emailBody += "Boundaries: " + boundariesLvl + "\n";
  emailBody += interp.boundaries[boundariesLvl] + "\n\n";
  
  emailBody += "Reactivity: " + reactivityLvl + "\n";
  emailBody += interp.reactivity[reactivityLvl] + "\n\n";
  
  emailBody += "Thinking Style:\n";
  emailBody += "• Overthinking: " + overthinkLvl + " — " + interp.overthink[overthinkLvl] + "\n";
  emailBody += "• Impulsivity: " + impulsivityLvl + " — " + interp.impulsivity[impulsivityLvl] + "\n";
  emailBody += "• Avoidance: " + avoidanceLvl + " — " + interp.avoidance[avoidanceLvl] + "\n\n";
  
  emailBody += "Social Radar: " + radarLvl + "\n";
  emailBody += interp.radar[radarLvl] + "\n\n";
  
  emailBody += "Social Interpretation: " + interpLvl + "\n";
  emailBody += interp.interp[interpLvl] + "\n\n";
  
  emailBody += "Intent vs Impact: " + intentLvl + "\n";
  emailBody += interp.intent[intentLvl] + "\n\n";
  
  emailBody += "---\n\n";
  emailBody += "WHAT'S NEXT?\n\n";
  emailBody += "This assessment shows you what's happening — your patterns and tendencies.\n";
  emailBody += "The next step is learning what to do about it. We're building guided tools for that. If you want early access, let me know.\n\n";
  
  emailBody += "---\n\n";
  emailBody += "QUICK QUESTIONS FOR YOU:\n\n";
  emailBody += "1. How accurate did this feel? (1-5)\n";
  emailBody += "2. What surprised you or felt off?\n";
  emailBody += "3. Would you want help working on any of these patterns?\n\n";
  emailBody += "Just reply to this email — I'd love your honest feedback.\n\n";
  emailBody += "Thanks,\n[Your name]";
  
  var outputSheet = ss.getSheetByName("Generated Emails");
  if (!outputSheet) {
    outputSheet = ss.insertSheet("Generated Emails");
    outputSheet.getRange("A1").setValue("Row");
    outputSheet.getRange("B1").setValue("Name");
    outputSheet.getRange("C1").setValue("Email");
    outputSheet.getRange("D1").setValue("Subject");
    outputSheet.getRange("E1").setValue("Body");
    outputSheet.setColumnWidth(5, 800);
  }
  
  var outputRow = outputSheet.getLastRow() + 1;
  outputSheet.getRange("A" + outputRow).setValue(row);
  outputSheet.getRange("B" + outputRow).setValue(name);
  outputSheet.getRange("C" + outputRow).setValue(email);
  outputSheet.getRange("D" + outputRow).setValue("Your Clarity Assessment Results");
  outputSheet.getRange("E" + outputRow).setValue(emailBody);
}
// ADD THIS TO YOUR EXISTING APPS SCRIPT

function sendAllResultsEmails() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var responseSheet = ss.getSheetByName("Form responses 1");
  var lastRow = responseSheet.getLastRow();
  
  var sentCount = 0;
  var errorCount = 0;
  
  for (var row = 2; row <= lastRow; row++) {
    var name = responseSheet.getRange("B" + row).getValue();
    var email = responseSheet.getRange("AP" + row).getValue();
    
    if (!name || !email) continue;
    
    // Check if already sent (we'll track this in column BQ)
    var sentStatus = responseSheet.getRange("BQ" + row).getValue();
    if (sentStatus === "SENT") continue;
    
    var overallLvl = responseSheet.getRange("AS" + row).getValue();
    var insightLvl = responseSheet.getRange("AU" + row).getValue();
    var clarityLvl = responseSheet.getRange("AW" + row).getValue();
    var learningLvl = responseSheet.getRange("AY" + row).getValue();
    var boundariesLvl = responseSheet.getRange("BA" + row).getValue();
    var reactivityLvl = responseSheet.getRange("BC" + row).getValue();
    var overthinkLvl = responseSheet.getRange("BE" + row).getValue();
    var impulsivityLvl = responseSheet.getRange("BG" + row).getValue();
    var avoidanceLvl = responseSheet.getRange("BI" + row).getValue();
    var radarLvl = responseSheet.getRange("BK" + row).getValue();
    var interpLvl = responseSheet.getRange("BM" + row).getValue();
    var intentLvl = responseSheet.getRange("BO" + row).getValue();
    
    // Skip if no scores yet
    if (!overallLvl) continue;
    
    var interp = {
      overall: {
        "Low": "You're still building a clear map of yourself. In high-stakes moments, it can be hard to tell what you want, what's true, and what's just noise.",
        "Medium": "You have a decent read on yourself, but clarity can blur under pressure. With a few upgrades, your decisions will feel cleaner and less draining.",
        "High": "You generally know what drives you. Your self-map is stable enough to guide choices, and you tend to learn and adjust over time."
      },
      insight: {
        "Low": "You may struggle to explain why you react the way you do. Triggers and patterns aren't always visible to you yet.",
        "Medium": "You sometimes understand your reactions, but under pressure it gets foggy.",
        "High": "You can usually name what's driving your reactions — fear, values, uncertainty — and that helps you respond better."
      },
      clarity: {
        "Low": "Your sense of self shifts depending on context or who you're with. Values and strengths may feel unclear.",
        "Medium": "You have a reasonable sense of who you are, but it can wobble under stress or social pressure.",
        "High": "Your values, strengths, and sense of identity are stable enough to guide decisions consistently."
      },
      learning: {
        "Low": "You may repeat patterns even after recognizing them. Reflecting on mistakes can feel difficult or painful.",
        "Medium": "You learn from some experiences but not others. Patterns sometimes repeat.",
        "High": "You reflect after key moments and adjust. You can learn from mistakes without excessive self-criticism."
      },
      boundaries: {
        "Low": "You protect your needs and can say no. You may want to check that warmth and flexibility are still present.",
        "Medium": "Boundaries slip under pressure. You sometimes over-give or delay hard conversations.",
        "High": "You tend to say yes when you mean no, feel responsible for others' comfort, and avoid difficult conversations until things build up."
      },
      reactivity: {
        "Low": "You stay steady under uncertainty. Emotions don't hijack your thinking. Watch for under-feeling or emotional avoidance.",
        "Medium": "You feel things but can usually manage. Under high stress, emotions may take over temporarily.",
        "High": "Uncertainty spikes your emotions quickly. It's hard to think clearly when activated, and returning to baseline takes time."
      },
      overthink: {
        "Low": "You act without excessive analysis. Make sure you're not skipping important reflection.",
        "Medium": "You balance thinking and doing, though you can get stuck sometimes.",
        "High": "You research and ruminate instead of taking small steps. Analysis becomes a way to avoid action."
      },
      impulsivity: {
        "Low": "You rarely act without thinking. Decisions are considered.",
        "Medium": "Sometimes you act fast and regret it, but not consistently.",
        "High": "You often act quickly and regret it later. Slowing down before decisions would help."
      },
      avoidance: {
        "Low": "You face decisions rather than postponing them.",
        "Medium": "You sometimes delay hoping things resolve themselves.",
        "High": "You tend to delay decisions, hoping the situation will sort itself out. It usually doesn't."
      },
      radar: {
        "Low": "You may miss subtle shifts in tone, energy, or group dynamics — especially under pressure.",
        "Medium": "You catch some signals but miss others, particularly when stressed or distracted.",
        "High": "You notice when something feels 'off' in interactions, even if it's subtle. You pick up on shifts in tone and energy."
      },
      interp: {
        "Low": "You tend to lock onto one explanation quickly — often 'it's about me' — without considering alternatives.",
        "Medium": "You sometimes jump to conclusions but can course-correct when prompted.",
        "High": "You hold multiple possible explanations and prefer to ask clarifying questions rather than assume."
      },
      intent: {
        "Low": "You may be unaware when your words or actions land differently than intended. Blind spots here can strain relationships.",
        "Medium": "You sometimes notice gaps between what you meant and how it landed.",
        "High": "You're generally aware that intent and impact don't always match, which helps you communicate and repair better."
      }
    };
    
    var emailBody = "Hi " + name + ",\n\n";
    emailBody += "Thanks for taking the Clarity Assessment. Here's what your responses reveal about how you make decisions and navigate relationships and work.\n\n";
    emailBody += "This is a reflection tool, not a diagnosis. The goal is awareness — not a label.\n\n";
    emailBody += "---\n\n";
    
    emailBody += "OVERALL SELF-AWARENESS: " + overallLvl + "\n";
    emailBody += interp.overall[overallLvl] + "\n\n";
    
    emailBody += "---\n\n";
    emailBody += "YOUR PILLARS\n\n";
    
    emailBody += "Insight: " + insightLvl + "\n";
    emailBody += interp.insight[insightLvl] + "\n\n";
    
    emailBody += "Clarity: " + clarityLvl + "\n";
    emailBody += interp.clarity[clarityLvl] + "\n\n";
    
    emailBody += "Learning: " + learningLvl + "\n";
    emailBody += interp.learning[learningLvl] + "\n\n";
    
    emailBody += "---\n\n";
    emailBody += "YOUR DECISION HABITS\n\n";
    
    emailBody += "Boundaries: " + boundariesLvl + "\n";
    emailBody += interp.boundaries[boundariesLvl] + "\n\n";
    
    emailBody += "Reactivity: " + reactivityLvl + "\n";
    emailBody += interp.reactivity[reactivityLvl] + "\n\n";
    
    emailBody += "Thinking Style:\n";
    emailBody += "• Overthinking: " + overthinkLvl + " — " + interp.overthink[overthinkLvl] + "\n";
    emailBody += "• Impulsivity: " + impulsivityLvl + " — " + interp.impulsivity[impulsivityLvl] + "\n";
    emailBody += "• Avoidance: " + avoidanceLvl + " — " + interp.avoidance[avoidanceLvl] + "\n\n";
    
    emailBody += "Social Radar: " + radarLvl + "\n";
    emailBody += interp.radar[radarLvl] + "\n\n";
    
    emailBody += "Social Interpretation: " + interpLvl + "\n";
    emailBody += interp.interp[interpLvl] + "\n\n";
    
    emailBody += "Intent vs Impact: " + intentLvl + "\n";
    emailBody += interp.intent[intentLvl] + "\n\n";
    
    emailBody += "---\n\n";
    emailBody += "WHAT'S NEXT?\n\n";
    emailBody += "This assessment shows you what's happening — your patterns and tendencies.\n";
    emailBody += "The next step is learning what to do about it. We're building guided tools for that. If you want early access, let me know.\n\n";
    
    emailBody += "---\n\n";
    emailBody += "---\n\n";
    emailBody += "ONE QUICK QUESTION:\n\n";
    emailBody += "How accurate did this feel? Reply with a number 1-5 (1 = way off, 5 = spot on)\n\n";
    emailBody += "If anything felt off, just tell me what.\n\n";
    emailBody += "Thanks,\nJolly";
    
    try {
      GmailApp.sendEmail(email, "Your Clarity Assessment Results", emailBody);
      responseSheet.getRange("BQ" + row).setValue("SENT");
      responseSheet.getRange("BR" + row).setValue(new Date());
      sentCount++;
    } catch (e) {
      responseSheet.getRange("BQ" + row).setValue("ERROR: " + e.message);
      errorCount++;
    }
  }
  
  Logger.log("Sent: " + sentCount + ", Errors: " + errorCount);
}

// Run this once to add the tracking columns
function setupEmailTracking() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("Form responses 1");
  
  sheet.getRange("BQ1").setValue("Email Status");
  sheet.getRange("BR1").setValue("Sent Date");
  sheet.getRange("BQ1:BR1").setFontWeight("bold").setBackground("#4472C4").setFontColor("white");
}
/*******************************************************
 * FRONTEND ↔ BACKEND API LAYER (Next.js Integration)
 *******************************************************/

function doGet() {
  return ContentService
    .createTextOutput(JSON.stringify({
      status: "OK",
      message: "Align Within backend is live"
    }))
    .setMimeType(ContentService.MimeType.JSON)
    .setHeader("Access-Control-Allow-Origin", "*");
}

function doPost(e) {
  try {
    const payload = JSON.parse(e.postData.contents);

    if (payload.type === "contact") {
      handleContactForm(payload);
      return jsonResponse("Contact message sent successfully");
    }

    if (payload.type === "assessment") {
      handleAssessmentSubmission(payload);
      return jsonResponse("Assessment submitted successfully");
    }

    throw new Error("Unknown request type");

  } catch (error) {
    return jsonError(error.message);
  }
}

/* CONTACT FORM → EMAIL */
function handleContactForm(data) {
  if (!data || typeof data !== "object") {
    throw new Error("Invalid contact payload");
  }

  const adminEmail = "jollybalva1@gmail.com";

  const subject = "New Contact Message — Align Within";
  const body =
    `Name: ${data.name || "N/A"}
Email: ${data.email || "N/A"}

Message:
${data.message || "No message"}`;

  GmailApp.sendEmail(adminEmail, subject, body);
}


/* ASSESSMENT → GOOGLE SHEET */
function handleAssessmentSubmission(payload) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName("Form responses 1");
  if (!sheet) throw new Error("Form responses 1 sheet not found");

  const row = [
    new Date(),
    payload.name || "",
    payload.email || "",
    payload.context || "",
    payload.careerVignette || "",
    payload.relationshipVignette || "",
    ...(payload.answers || [])
  ];

  sheet.appendRow(row);
}

function jsonResponse(msg) {
  return ContentService
    .createTextOutput(JSON.stringify({ status: "success", message: msg }))
    .setMimeType(ContentService.MimeType.JSON)
    .setHeader("Access-Control-Allow-Origin", "*");
}

function jsonError(msg) {
  return ContentService
    .createTextOutput(JSON.stringify({ status: "error", message: msg }))
    .setMimeType(ContentService.MimeType.JSON)
    .setHeader("Access-Control-Allow-Origin", "*");
}

function testEmailNow() {
  GmailApp.sendEmail(
    "jollybalva1@gmail.com",
    "TEST — Align Within",
    "If you received this email, Gmail permissions and sending work correctly."
  );
}



