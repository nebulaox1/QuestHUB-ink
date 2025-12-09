// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title InkStreak
 * @dev A simple contract to track daily user streaks on Inkchain.
 * Users verify their daily activity by sending a transaction.
 */
contract InkStreak {
    // State variables
    mapping(address => uint256) public streaks;
    mapping(address => uint256) public lastCheckInDay;
    
    address public owner;
    uint256 public constant CHECKIN_FEE = 0.0001 ether; // ~0.30 USD, small fee to prevent spam

    // Events
    event StreakUpdated(address indexed user, uint256 newStreak, uint256 timestamp);
    event StreakReset(address indexed user, uint256 timestamp);
    
    constructor() {
        owner = msg.sender;
    }

    /**
     * @dev Check in to keep the daily streak alive.
     * Must be called once per UTC day.
     * Requires a small fee.
     */
    function checkIn() external payable {
        require(msg.value >= CHECKIN_FEE, "Insufficient fee: Must send at least 0.0001 ETH");

        uint256 currentDay = block.timestamp / 1 days;
        uint256 lastDay = lastCheckInDay[msg.sender];

        if (lastDay == 0) {
            // First time check-in
            streaks[msg.sender] = 1;
        } else if (currentDay == lastDay) {
            // Already checked in today
            revert("Already checked in today! Come back tomorrow.");
        } else if (currentDay == lastDay + 1) {
            // Consecutive day - Increment streak
            streaks[msg.sender] += 1;
        } else {
            // Missed a day (currentDay > lastDay + 1) - Reset streak
            streaks[msg.sender] = 1;
            emit StreakReset(msg.sender, block.timestamp);
        }

        lastCheckInDay[msg.sender] = currentDay;
        
        emit StreakUpdated(msg.sender, streaks[msg.sender], block.timestamp);
    }

    /**
     * @dev Get the current streak for a user.
     * Returns 0 if the user missed a day and hasn't reset yet.
     */
    function getStreak(address user) external view returns (uint256) {
        uint256 currentDay = block.timestamp / 1 days;
        uint256 lastDay = lastCheckInDay[user];

        if (lastDay == 0) return 0;
        if (currentDay > lastDay + 1) return 0; // Streak is technically broken, even if state not updated
        return streaks[user];
    }

    /**
     * @dev Withdraw collected fees. Only owner.
     */
    function withdraw() external {
        require(msg.sender == owner, "Only owner can withdraw");
        payable(owner).transfer(address(this).balance);
    }
}
