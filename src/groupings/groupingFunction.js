const generateGroupings = (confirmedParticipants, numGroups) => {
  const sortByAge = (participants) => {
    return participants.sort((obj1, obj2) => {
      return obj2.year - obj1.year;
    });
  };

  const splitGender = (participants) => {
    const male = [];
    const female = [];

    for (const participant of participants) {
      if (participant.isMale === true) {
        male.push(participant);
      } else {
        female.push(participant);
      }
    }

    return { male, female };
  };

  const { male, female } = splitGender(sortByAge(confirmedParticipants));

  let majority, minority;

  if (male.length > female.length) {
    majority = male;
    minority = female;
  } else if (male.length <= female.length) {
    majority = female;
    minority = male;
  }

  let remainderMinority = minority.length % numGroups;
  let remainderPeople = confirmedParticipants.length % numGroups;
  const groupSize = Math.floor(confirmedParticipants.length / numGroups);
  const minorityPerGroup = Math.floor(minority.length / numGroups);

  // for testing
  console.log("Number of people: ", confirmedParticipants.length);
  console.log("Number of groups: ", numGroups);
  console.log("Group Size: ", groupSize);
  console.log("Number of minority: ", minority.length);
  console.log("Remaining minority after equal division: ", remainderMinority);
  console.log("Number of majority: ", majority.length);
  console.log("Remaining people after equal division: ", remainderPeople);
  console.log("Minimum minority per group: ", minorityPerGroup);
  //

  let minorityIndex = 0;
  let majorityIndex = 0;

  // for testing
  let totalMinority = 0;
  let totalMajority = 0;
  //

  for (let groupId = 1; groupId <= numGroups; groupId++) {
    let currentGroupSize = 0;

    // for testing
    console.log(`----Group ${groupId}----`);
    //

    while (
      currentGroupSize < minorityPerGroup &&
      minorityIndex < minority.length
    ) {
      minority[minorityIndex].groupId = groupId;

      // for testing
      console.log(minority[minorityIndex]);
      totalMinority += 1;
      //

      currentGroupSize += 1;
      minorityIndex += 1;
    }

    // if there are still remainder minorities to distribute
    if (remainderMinority > 0 && minorityIndex < minority.length) {
      minority[minorityIndex].groupId = groupId;

      // for testing
      console.log(minority[minorityIndex]);
      totalMinority += 1;
      //

      currentGroupSize += 1;
      minorityIndex += 1;
      remainderMinority -= 1;
    }

    while (currentGroupSize < groupSize && majority[majorityIndex]) {
      majority[majorityIndex].groupId = groupId;

      // for testing
      console.log(majority[majorityIndex]);
      totalMajority += 1;
      //

      currentGroupSize += 1;
      majorityIndex += 1;
    }

    /* 
      if there are remaining people after we equally split the total participants, we add them to this group
      assume that the remaining people are from the majority. When we previously distributed remaining minorities,
      the remaining minorities are already accounted for 
    */
    if (remainderPeople > 0) {
      majority[majorityIndex].groupId = groupId;

      // for testing
      console.log(majority[majorityIndex]);
      totalMajority += 1;
      //

      currentGroupSize += 1;
      majorityIndex += 1;
      remainderPeople -= 1;
    }

    // for testing
    console.log("");
    console.log(
      `Mi: ${totalMinority}, Ma: ${totalMajority}, Total: ${
        totalMinority + totalMajority
      }`
    );
    console.log("");
    //
  }
  return minority.concat(majority);
};
export default generateGroupings;
