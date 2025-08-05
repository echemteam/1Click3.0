import React, { useState, useEffect } from "react";
import "./Progressbar.scss";
import { useLazyGetUserProfilePercentageQuery } from "src/redux/serviceApi/userAPI";

const Progressbar = ({
  variant = "linear",
  value = false,
  filled = false,
}) => {
  const [animatedProgress, setAnimatedProgress] = useState(0);
  const [progress,setProgress]=useState(0);

    const [getUserProfilePercentage,{isFetching:getUserProfilePercentageFetching,isSuccess:getUserProfilePercentageSuccess,data:getUserProfilePercentageData}]=useLazyGetUserProfilePercentageQuery()

    useEffect(()=>{
        getUserProfilePercentage()
    },[getUserProfilePercentage])

    useEffect(()=>{
        if(!getUserProfilePercentageFetching && getUserProfilePercentageSuccess && getUserProfilePercentageData ){
            if(getUserProfilePercentageData){
                setProgress(getUserProfilePercentageData.userProfilePercentage)
            }

        }
    },[getUserProfilePercentageFetching,getUserProfilePercentageSuccess,getUserProfilePercentageData])

  useEffect(() => {
    setAnimatedProgress(0);
    const step = progress / 50;
    let currentProgress = 0;

    const interval = setInterval(() => {
      currentProgress += step;
      if (currentProgress >= progress) {
        setAnimatedProgress(progress);
        clearInterval(interval);
      } else {
        setAnimatedProgress(currentProgress);
      }
    }, 10);

    return () => clearInterval(interval);
  }, [progress]);

  if (variant === "circular") {
    const radius = 16;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = ((100 - animatedProgress) / 100) * circumference;

    // Convert progress into degrees for pie chart effect
    const angle = (animatedProgress / 100) * 360;
    const largeArcFlag = angle > 180 ? 1 : 0;
    const radians = (angle - 90) * (Math.PI / 180);
    const x = 18 + 16 * Math.cos(radians);
    const y = 18 + 16 * Math.sin(radians);

    return (
      <div className="progressbar-circular">
        <svg className="circular-progress" viewBox="0 0 36 36">
          {/* Background Circle */}
          <circle className="circle-bg" cx="18" cy="18" r={radius} />

          {filled ? (
            // Filled Pie Shape
            <path
              className="filled-progress"
              d={`M18,18 L18,2 A16,16 0 ${largeArcFlag},1 ${x},${y} Z`}
            />
          ) : (
            // Stroke-based circular progress
            <circle
              className="circle"
              cx="18"
              cy="18"
              r={radius}
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
            />
          )}
        </svg>

        {value && (
          <div className="progress-value">{Math.round(animatedProgress)}%</div>
        )}
      </div>
    );
  }

  return (
    <div className="progressbar-linear-container">
      <div className="progressbar-linear">
        <div
          className="linear-progress"
          style={{ width: `${animatedProgress}%` }}
        ></div>
      </div>
      {value && (
        <div className="progress-label">{Math.round(animatedProgress)}%</div>
      )}
    </div>
  );
};

export default Progressbar;
